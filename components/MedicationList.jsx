import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import color from '../constant/color';
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import moment from 'moment';
import { getLocalStorage } from '../service/Storage';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '../config/FirebaseConfig';
import MedicationCardItem from '../components/MedicationCardItem';
import EmptyState from '../components/EmptyState';
import { useRouter } from 'expo-router';

export default function MedicationList() {

  const [medList, setMedList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetDateRangeList();
    GetMedicationList(selectedDate);
  }, []);

  const GetDateRangeList = () => {
    const dateRange = GetDateRangeToDisplay();
    setDateRange(dateRange);
  };

  const GetMedicationList = async (selectedDate) => {
    setLoading(true);
    try {
      const user = await getLocalStorage('userDetail');
      if (!user?.email) {
        console.error("No user email found in local storage.");
        return;
      }
      const q = query(
        collection(db, 'medication'),
        where('userEmail', '==', user.email),
        where('dates', 'array-contains', selectedDate)
      );
      const querySnapshot = await getDocs(q);
      const medications = [];
      querySnapshot.forEach((doc) => {
        medications.push(doc.data());
      });
      setLoading(false);
      setMedList(medications);
    } catch (e) {
      console.error("Error fetching medication list:", e);
    }
  };

  return (
    <View style={{ marginTop: 25}}>
      <Image
        source={require('./../assets/images/medication.jpeg')}
        style={{
          width: '100%',
          height: 200,
          borderRadius: 15,
        }}
      />

      <FlatList
        data={dateRange}
        horizontal
        style={{ marginTop: 15}}
        keyExtractor={(item) => item.formattedDate}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateGroup,
              { backgroundColor: item.formattedDate === selectedDate ? color.PRIMARY : color.LIGHT_GRAY_BORDER }
            ]}
            onPress={() => {
              setSelectedDate(item.formattedDate);
              GetMedicationList(item.formattedDate);
            }}
          >
            <Text style={[styles.day, { color: item.formattedDate === selectedDate ? 'white' : 'black' }]}>{item?.day}</Text>
            <Text style={[styles.date, { color: item.formattedDate === selectedDate ? 'white' : 'black' }]}>{item?.date}</Text>
          </TouchableOpacity>
        )}
      />
     {medList.length>0? <FlatList
        data={medList}
        onRefresh={() => GetMedicationList(selectedDate)}
        refreshing={loading}
        renderItem={({ item, index }) => (
          <TouchableOpacity
          onPress={()=>router.push({
            pathname:'/action-modal',
            params:{
              ...item,
              selectedDate:selectedDate
            }
          })}
          >
            <MedicationCardItem medicine={item} selectedDate={selectedDate}/>
          </TouchableOpacity>
        )}
      />:<EmptyState/>}
    </View>
  );
}

export const styles = StyleSheet.create({
  dateGroup: {
    padding: 15,
    backgroundColor: color.LIGHT_GRAY_BORDER,
    display: 'flex',
    alignContent: 'center',
    marginRight: 10,
    borderRadius: 10,
  },
  day: {
    fontSize: 16,
  },
  date: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
