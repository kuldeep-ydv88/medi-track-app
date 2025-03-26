import { View, FlatList } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import MedicationList from '../../components/MedicationList'

export default function index() {
  return (

    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={{
          padding: 25,
          backgroundColor: 'white',
          height: '100%',
          width: '100%'
        }}>
          <Header />
          <MedicationList />
        </View>
      }
    />

  )
}