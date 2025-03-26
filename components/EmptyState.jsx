import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import ConstantString from '../constant/ConstantString'
import color from '../constant/color'
import { useRouter } from 'expo-router'

export default function EmptyState() {
    
    const router = useRouter();

  return (
    <View style={{
        marginTop:20,
        display:'flex',
        alignItems:'center'
    }}>
        <Image source={require('./../assets/images/medicine.png')}
        style={{
            width:120,
            height:120
        }}
        />
        <Text style={{
            fontSize:35,
            fontWeight:'bold',
            marginTop:15,
        }}>{ConstantString.NoMedication}</Text>
        <Text style={{
            fontSize:16,
            color:color.DARK_GRAY,
            textAlign:'center',
            marginTop:15
        }}>{ConstantString.MedicationSubText}</Text>
        <TouchableOpacity style={{
            backgroundColor:color.PRIMARY,
            padding:15,
            borderRadius:10,
            marginTop:15,
            width:'100%'
        }}
        onPress={()=>router.push('/add-new-medication')}
        >
        <Text style={{
            textAlign:'center',
            fontSize:17,
            color:'white'
        }}>{ConstantString.AddNewMediciationBtn}</Text>
        </TouchableOpacity>
    </View>
  )
} 