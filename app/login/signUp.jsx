import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import color from '../../constant/color'
import { useRouter } from 'expo-router'
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import { setLocalStorage } from '../../service/Storage';

export default function SignUp() {

    const router = useRouter();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [userName, setUserName] =  useState();

    const OnCreateAccount=()=>{

        if(!email || !password){
            ToastAndroid.show('Please fill all details', ToastAndroid.BOTTOM);
            Alert.alert('Please Enter email and password');
        }
        createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential)=>{
            const user = userCredential.user;

            await updateProfile(user,{
                displayName:userName,
            })
           await setLocalStorage('userDetail', user);
            console.log(user);
            router.push('(tabs)');
        })
        .catch((error)=>{
            const errorCode= error.code;
            const errorMessage =error.message;
            console.log(errorCode);
            if(errorCode =='auth/email-already-in-use'){
                Alert.alert('Email already exit');
            }

        })
    }
    
  return (
    <View style={{
                padding: 25
            }}>
                <Text style={styles.textHeader}>Create New Account</Text>

                <View style={{
                    marginTop: 25
                }}>
                    <Text> Full Name</Text>
                    <TextInput placeholder='Full Name' style={styles.textInput}
                     onChangeText={(value)=>setUserName(value)}
                    ></TextInput>
                </View>
    
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
                <TouchableOpacity style={styles.button} onPress={OnCreateAccount}>
                    <Text style={{
                        fontSize:17,
                        color:'white',
                        textAlign:'center'
                    }}>Create Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCreate}
                onPress={()=>router.push('login/signIn')}
                >
                    <Text style={{
                        fontSize:17,
                        color:color.PRIMARY,
                        textAlign:'center',
    
                    }}>Already account? Sign In</Text>
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