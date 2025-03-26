import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetPrevDateRangeToDisplay } from '../../service/ConvertDateTime';
import color from '../../constant/color';
import { useRouter } from 'expo-router';
import { getLocalStorage } from '../../service/Storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import MedicationCardItem from '../../components/MedicationCardItem';

export default function History() {
  const [medList, setMedList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().subtract(1, 'days').format('MM/DD/YYYY'));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetDateList();
    if (selectedDate) {
      GetMedicationList(selectedDate);
    }
  }, [selectedDate]);

  const GetDateList = () => {
    const dates = GetPrevDateRangeToDisplay();
    setDateRange(dates);
  }

  const GetMedicationList = async (date) => {
    setLoading(true);
    try {
      const user = await getLocalStorage('userDetail');
      const q = query(
        collection(db, 'medication'),
        where('userEmail', '==', user.email),
        where('dates', 'array-contains', date)
      );
      const querySnapshot = await getDocs(q);
      const medications = [];
      querySnapshot.forEach((doc) => {
        medications.push(doc.data());
      });
      setMedList(medications);
    } catch (e) {
      console.error("Error fetching medication list:", e);
    } finally {
      setLoading(false);
    }
  };

  return (

    <FlatList
    data={[]}
    style={{
      height:'100%',
      backgroundColor:'white'
    }}
    ListHeaderComponent={
      <View style={styles.mainContainer}>
      <Image
        source={require('./../../assets/images/med-history.png')}
        style={styles.imageBanner}
      />
      <Text style={styles.header}>Medication History</Text>
      <FlatList
        data={dateRange}
        horizontal
        style={{ marginTop: 15 }}
        keyExtractor={(item) => item.formattedDate}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateGroup,
              { backgroundColor: item.formattedDate === selectedDate ? color.PRIMARY : color.LIGHT_GRAY_BORDER }
            ]}
            onPress={() => {setSelectedDate(item.formattedDate)
              GetMedicationList(item.formattedDate);
            }}
          >
            <Text style={[styles.day, { color: item.formattedDate === selectedDate ? 'white' : 'black' }]}>{item.day}</Text>
            <Text style={[styles.date, { color: item.formattedDate === selectedDate ? 'white' : 'black' }]}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {medList.length>0? <FlatList
              data={medList}
              onRefresh={() => GetMedicationList(selectedDate)}
              refreshing={loading}
              renderItem={({ item, index }) => (
                <TouchableOpacity>
                <MedicationCardItem medicine={item} selectedDate={selectedDate}/>
                </TouchableOpacity>
              )}
            />:
            <Text style={{
              fontSize:25,
              padding:30,
              fontWeight:'bold',
              textAlign:'center',
              color:color.GRAY
            }}>No Medication Found</Text>
            }


    </View>
    }
    />
   
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 25,
    backgroundColor: 'white',
  },
  imageBanner: {
    width: '100%',
    height: 200,
    borderRadius: 15
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dateGroup: {
    padding: 15,
    backgroundColor: color.LIGHT_GRAY_BORDER,
    display: 'flex',
    alignContent: 'center',
    marginRight: 10,
    borderRadius: 10
  },
  day: {
    fontSize: 16,
  },
  date: {
    fontSize: 26,
    fontWeight: 'bold'
  }
});