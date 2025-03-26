import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import color from '../../constant/color'
import { useRouter } from 'expo-router'

export default function LoginScreen() {

  const router = useRouter();

  return (
    <View>
      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 30,
      }}>
        <Image source={require('./../../assets/images/login.jpg')}
          style={styles.image}
        />
      </View>
      <View style={{
        padding:25,
        backgroundColor:color.PRIMARY,
        height:'100%'
      }}>
        <Text style={{
          fontSize:30,
          fontWeight:'bold',
          color:'white',
          textAlign:'center'
        }}>Stay on Track, Stay Healthy!</Text>
        <Text
        style={{
          color:'white',
          textAlign:'center',
          fontSize:17,
          marginTop:20
        }}
        >Track your meds, take control of you health Stay consistent, stay confident</Text>

      <TouchableOpacity style={styles.button}
      onPress={()=>router.push('login/signIn')}
      >
        <Text style={{
          textAlign:'center',
          fontSize:16,
          color:color.PRIMARY
        }}>Continue</Text>
      </TouchableOpacity>
        <Text style={{
          color:'white',
          marginTop:10
        }}>Note: By Clicking Continue button, you will  agree to our term and condtion</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 210,
    height: 400,
    borderRadius: 23
  },
  button:{
    padding:15,
    backgroundColor:'white',
    borderRadius:99,
    marginTop:25,

  }
})