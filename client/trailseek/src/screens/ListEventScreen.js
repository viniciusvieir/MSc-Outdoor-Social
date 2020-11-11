import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, ListItem } from 'react-native-elements'

const ListEventScreen = ({ navigation }) => {
  const list = [
    {
      name: 'Event - TEST',
      subtitle: 'Location',
    },
    {
      name: 'Event1',
      subtitle: 'Location',
    },
  ]
  return (
    <>
      <Text h3>ListEventScreen</Text>
      {list.map((l, i) => (
        //ViewNavigation to be changes part of a different stack in navigation, maybe use navigation reset TBD
        <ListItem
          key={i}
          bottomDivider
          onPress={() => {
            navigation.navigate('ViewEvent')
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </>
  )
}

const styles = StyleSheet.create({})

export default ListEventScreen
