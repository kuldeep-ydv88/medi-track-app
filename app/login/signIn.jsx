import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import color from '../../constant/color'
import { useRouter } from 'expo-router'
import { auth } from '../../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { setLocalStorage } from '../../service/Storage';

export default function signIn() {

    const router =  useRouter()
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const OnSignInClick=()=>{

        if(!email || !password){
            Alert.alert('Please enter email & password');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential)=>{
            const user = userCredential.user;
            await setLocalStorage('userDetail', user);
            router.replace('(tabs)');
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode == 'auth/invalid-credential'){
                Alert.alert('Invalid email  or password');
            }
        })
    }

    return (
        <View style={{
            padding: 25
        }}>
            <Text style={styles.textHeader}>Let's sign You In</Text>
            <Text style={styles.subHeader}>Welcome Back</Text>
            <Text style={styles.subHeader}>You've  been missed!</Text>

            <View style={{
                marginTop: 25
            }}>
                <Text> Email</Text>
                <TextInput placeholder='Email' style={styles.textInput}
                onChangeText={(value)=>setEmail(value)}
                ></TextInput>
            </View>
            <View style={{
                marginTop: 25
            }}>
                <Text>Password</Text>
                <TextInput placeholder='Password' style={styles.textInput}
                    secureTextEntry={true}
                    onChangeText={(value)=>setPassword(value)}
                ></TextInput>
            </View>
            <TouchableOpacity style={styles.button}
            onPress={OnSignInClick}
            >
                <Text style={{
                    fontSize:17,
                    color:'white',
                    textAlign:'center'
                }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCreate}
            onPress={()=>router.push('login/signUp')}
            >
                <Text style={{
                    fontSize:17,
                    color:color.PRIMARY,
                    textAlign:'center',

                }}>Create Account</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    textHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 15
    },
    subHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
        color: color.GRAY
    },
    textInput: {
        padding: 10,
        borderWidth: 1,
        fontSize: 17,
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: 'white'
    },
    button:{
        padding:20,
        backgroundColor:color.PRIMARY,
        borderRadius:10,
        marginTop:30

    },
    buttonCreate:{
        padding:20,
        backgroundColor:'white',
        borderRadius:10,
        marginTop:30,
        borderWidth:1,
        borderColor:color.PRIMARY
    }
})