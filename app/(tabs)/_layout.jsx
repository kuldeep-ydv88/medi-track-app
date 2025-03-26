import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getLocalStorage } from '../../service/Storage';

export default function TabLayOut() {
  const router = useRouter();

  useEffect(() => {
    GetUserDetails();
  }, []);

  const GetUserDetails = async () => {
    const userInfo = await getLocalStorage('userDetail');
    if (!userInfo) {
      router.replace('/login');
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007dfc',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ size, color }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ size, color }) => <FontAwesome name="history" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ size, color }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
