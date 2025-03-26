import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLocalStorage, RemoveLocalStorage } from '../../service/Storage'
import { useRouter } from 'expo-router';
import color from '../../constant/color';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function () {
  const Menu = [
    {
      id: 1,
      name: 'Add New Medication',
      icon: 'add-circle',
      path: '/add-new-medication'
    },
    {
      id: 3,
      name: 'History',
      icon: 'time',
      path: '/History'
    },
    {
      id: 2,
      name: 'My Medication',
      icon: 'medkit',
      path: '(tabs)'
    },
    {
      id: 4,
      name: 'Logout',
      icon: 'exit',
      path: 'logout'
    }
  ]

  const [userData, setUserData] = useState();
  const router = useRouter();

  useEffect(() => {
    GetUser();
  }, [])

  const GetUser = async () => {
    const userData = await getLocalStorage('userDetail');
    setUserData(userData);
  }

  const onPressMenu = async (menu) => {
    if (menu.path === 'logout') {
      await RemoveLocalStorage('userDetail');
      router.replace('/login');
    } else {
      router.push(menu.path);
    }
  };

  return (
    <View style={{
      padding: 25,
      backgroundColor: 'white',
      height: '100%'
    }}>
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 30,
        fontWeight: 'bold'
      }}>Profile</Text>

      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginVertical: 25
      }}>
        <Image source={require('./../../assets/images/smiley.png')}
          style={{
            width: 80,
            height: 80
          }} />
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 24,
          marginTop: 6,
          fontWeight: 'bold'
        }}>{userData?.displayName}</Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 16,
          color: color.GRAY,
        }}>{userData?.email}</Text>
      </View>
      <FlatList
        data={Menu}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={item.id}
            style={{
              marginVertical: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10
            }}>
            <Ionicons name={item?.icon} size={30}
              color={color.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: color.LIGHT_PRIMARY,
                borderRadius: 10
              }}
            />
            <Text style={{
              fontFamily: 'outfit',
              fontSize: 20
            }}>{item?.name}</Text>

          </TouchableOpacity>
        )}
      />

    </View>
  )
}