import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { ListItem } from 'react-native-elements'

const EventsTab = ({ trailData }) => {
  // const [events] = useState([])

  const list = [
    {
      name: 'Event0',
      subtitle: 'Location',
    },
    {
      name: 'Event1',
      subtitle: 'Location',
    },
  ]

  const navigation = useNavigation()
  return (
    <>
      <Button
        onPress={() => {
          navigation.navigate('TrailFlow', {
            screen: 'CreateEvent',
          })
        }}
        full
        style={{ margin: 5 }}
      >
        <Text>Create Event</Text>
      </Button>
      {list.map((l, i) => (
        //ViewNavigation to be changes part of a different stack in navigation, maybe use navigation reset TBD
        <ListItem
          key={i}
          bottomDivider
          onPress={() => {
            navigation.navigate('EventFlow', { screen: 'ViewEvent' })
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      {/* <Button
        onPress={() => {
          navigation.navigate("ListEvent");
        }}
      >
        <Text>Join Events</Text>
      </Button> */}
    </>
  )
}

const styles = StyleSheet.create({})

export default EventsTab
