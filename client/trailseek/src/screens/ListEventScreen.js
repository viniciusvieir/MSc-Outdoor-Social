import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, ListItem } from 'react-native-elements'
import trailSeek from '../api/trailSeek'

const ListEventScreen = ({ navigation }) => {
  const [events, setEvents] = useState([])

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

  useEffect(async () => {
    try {
      const results = await trailSeek.get('/trails/:trailId/events') // need to send :trailId
      setEvents(results)
    } catch (e) {
      console.log(e)
      ToastAlert(e.message)
    }
  }, [])

  return (
    <>
      <Text h3>ListEventScreen</Text>
      {events.map((l, i) => (
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
