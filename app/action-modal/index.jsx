import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import color from '../../constant/color';
import MedicationCardItem from '../../components/MedicationCardItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import {db} from '../../config/FirebaseConfig'
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';

export default function MedicationActionModal() {
    const medicine = useLocalSearchParams();
    const router = useRouter();
    
    const UpdateActionstate = async (status) => {
        try {
            const docRef = doc(db, 'medication', medicine?.docId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) return;
            let actions = docSnap.data().action || [];
            let updatedActions = actions.map(item =>
                item.date === medicine.selectedDate
                    ? { ...item, status: status, time: moment().format('LT') }
                    : item
            );
            if (!actions.some(item => item.date === medicine.selectedDate)) {
                updatedActions.push({
                    status: status,
                    time: moment().format('LT'),
                    date: medicine?.selectedDate
                });
            }
            await updateDoc(docRef, { action: updatedActions });
            Alert.alert(status, 'Response Updated!', [
                {
                    text: 'Ok',
                    onPress: () => router.replace('(tabs)')
                }
            ]);
    
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/notification.gif')}
                style={{
                    width: 120,
                    height: 120
                }}
            />
            <Text style={{ fontSize: 18 }}>{medicine?.selectedDate}</Text>
            <Text style={{ fontSize: 38, fontWeight: 'bold', color: color.PRIMARY }}>{medicine?.reminder}</Text>
            <Text style={{ fontSize: 18 }}>It's time to take</Text>

            <MedicationCardItem medicine={medicine} />

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.closeBtn}
                onPress={()=> UpdateActionstate('Missed')}
                >
                    <Ionicons name="close-outline" size={24} color="red" />
                    <Text style={{
                        fontSize: 20,
                        color: 'red'
                    }}>Missed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.successBtn}
                 onPress={()=> UpdateActionstate('Taken')}
                >
                    <Ionicons name="checkmark-outline" size={24} color="white" />
                    <Text style={{
                        fontSize: 20,
                        color: 'white'
                    }}>Taken</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    position: 'absolute',
                    bottom: 25
                }}>
                <Ionicons name="close-circle" size={44} color={color.GRAY} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '100%'
    },
    closeBtn: {
        padding: 10,
        flexDirection: 'row',
        gap: 6,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: 'red',
        borderRadius: 10
    },
    successBtn: {
        padding: 10,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: color.GREEN,
    },
    btnContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 25
    }
})