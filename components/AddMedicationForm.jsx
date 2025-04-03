import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import color from '../constant/color';
import { TypeList, WhenToTake } from '../constant/Options';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { formatDateForText, formatTime, getDatesRanges } from '../service/ConvertDateTime';
import { getLocalStorage } from '../service/Storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import ConstantString from '../constant/ConstantString';

export default function AddMedicationForm() {

    const [formData, setFormData] = useState({});
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const SaveMedication = async () => {
        const docId = Date.now().toString();
        const user = await getLocalStorage('userDetail');
        if (!formData?.name || !formData?.type || !formData?.dose || !formData?.startDate || !formData?.endDate || !formData?.reminder) {
            Alert.alert('Enter all fields');
            return;
        }
        const dates = getDatesRanges(formData?.startDate, formData?.endDate);
        setLoading(true)
        try {
            await setDoc(doc(db, 'medication', docId), {
                ...formData,
                userEmail: user?.email,
                docId: docId,
                dates: dates
            });
            Alert.alert('Great!', 'New Medication added successfully', [
                {
                    text: 'Ok',
                    onPress: () => router.push('/(tabs)')
                }
            ]);
            setLoading(false)
        } catch (e) {
            console.error(e);
            setLoading(false)
        }
    };


    return (
        <View style={{ padding: 20 }}>
            <Text style={styles.header}>Add New Medication</Text>
            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="medkit-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder='Medicine Name'
                    onChangeText={(value) => onHandleInputChange('name', value)}
                />
            </View>

            <FlatList
                data={TypeList}
                horizontal
                style={{ marginTop: 2 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.inputGroup,
                            { marginRight: 10, backgroundColor: item.name === formData?.type?.name ? color.PRIMARY : 'white' }
                        ]}
                        onPress={() => onHandleInputChange('type', item)}
                    >
                        <Text style={[
                            styles.typeText,
                            { color: item.name === formData?.type?.name ? 'white' : 'black' }
                        ]}>
                            {item?.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Dose */}
            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="eyedrop-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder='Dose Ex. 2, 5ml'
                    onChangeText={(value) => onHandleInputChange('dose', value)}
                />
            </View>

            {/* When To Take Dropdown */}
            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="time-outline" size={24} color="black" />
                <Picker
                    style={{ width: '90%' }}
                    selectedValue={formData?.when}
                    onValueChange={(itemValue) => onHandleInputChange('when', itemValue)}
                >
                    {WhenToTake.map((item, index) => (
                        <Picker.Item label={item} key={index} value={item} />
                    ))}
                </Picker>
            </View>

            {/* Start and End date */}
            <View style={styles.dateInputGroup}>
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowStartDate(true)}
                >
                    <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
                    <Text style={styles.textDate}>
                        {formData?.startDate ? formatDateForText(new Date(formData.startDate)) : 'Start Date'}
                    </Text>
                </TouchableOpacity>
                {showStartDate && (
                    <RNDateTimePicker
                        minimumDate={new Date()}
                        value={formData?.startDate ? new Date(formData.startDate) : new Date()}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                onHandleInputChange('startDate', selectedDate);
                            }
                            setShowStartDate(false);
                        }}
                    />
                )}
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowEndDate(true)}
                >
                    <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
                    <Text style={styles.textDate}>
                        {formData?.endDate ? formatDateForText(new Date(formData.endDate)) : 'End Date'}
                    </Text>
                </TouchableOpacity>
                {showEndDate && (
                    <RNDateTimePicker
                        minimumDate={new Date()}
                        value={formData?.endDate ? new Date(formData.endDate) : new Date()}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                onHandleInputChange('endDate', selectedDate);
                            }
                            setShowEndDate(false);
                        }}
                    />
                )}
            </View>

            {/* Time Picker */}
            <View style={styles.dateInputGroup}>
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Ionicons style={styles.icon} name="timer-outline" size={24} color="black" />
                    <Text style={styles.textDate}>
                        {formData?.reminder ? formData.reminder : 'Select Reminder Time'}
                    </Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <RNDateTimePicker
                        mode="time"
                        value={new Date()}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                const formattedTime = formatTime(selectedDate);
                                onHandleInputChange('reminder', formattedTime);
                            }
                            setShowTimePicker(false);
                        }}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={SaveMedication}>
                {loading ? <ActivityIndicator size={'large'} color={'white'} /> :
                    <Text style={styles.buttonText}>{ConstantString.AddNewMediciationBtn}</Text>}
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: color.LIGHT_GRAY_BORDER,
        marginTop: 7,
        backgroundColor: 'white'
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16
    },
    icon: {
        color: color.PRIMARY,
        borderRightWidth: 1,
        paddingRight: 12,
        borderColor: color.GRAY
    },
    typeText: {
        fontSize: 16
    },
    textDate: {
        fontSize: 16,
        padding: 5,
        flex: 1,
        marginLeft: 10
    },
    dateInputGroup: {
        flexDirection: 'row',
        gap: 10
    },
    button: {
        padding: 15,
        backgroundColor: color.PRIMARY,
        borderRadius: 15,
        width: '100%',
        marginTop: 15
    },
    buttonText: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center'
    }
});
