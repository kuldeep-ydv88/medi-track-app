import { View, Text, Image, StyleSheet } from 'react-native'
import color from '../constant/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';

export default function MedicationCardItem({ medicine, selectedDate = '' }) {

    const [status, setStatus] = useState();

    useEffect(() => {
        checkStatus();
    }, [medicine, selectedDate]);


    const checkStatus = () => {
        if (Array.isArray(medicine?.action)) {
            const data = medicine.action.find((item) => item.date === selectedDate);
            setStatus(data);
        } else {
            setStatus(null);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: medicine?.type?.icon }}
                        style={{
                            width: 60,
                            height: 40,
                            marginLeft: 10
                        }}
                    />
                </View>
                <View>
                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{medicine?.name}</Text>
                    <Text style={{ fontSize: 17 }}>{medicine?.when}</Text>
                    <Text>{medicine?.dose} {medicine?.type?.name}</Text>
                </View>
            </View>
            <View style={styles.reminderContainer}>
                <Ionicons name="time-outline" size={24} color="black" />
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{medicine?.reminder}</Text>
            </View>
            {status?.date && <View style={styles.statusContainer}>
                {status?.status == 'Taken' ? <Ionicons name="checkmark-circle" size={24} color={color.GREEN} /> :
                    status?.status == 'Missed' &&
                    <Ionicons name="close-circle" size={24} color='red' />}
            </View>}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderColor: color.LIGHT_GRAY_BORDER,
        marginTop: 10,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    imageContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        marginRight: 15,
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    reminderContainer: {
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center'
    },
    statusContainer: {
        position: 'absolute',
        top: 5,
        padding: 2
    }

})