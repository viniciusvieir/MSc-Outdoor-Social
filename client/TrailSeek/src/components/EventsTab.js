import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import {
  Text,
  Button,
  List,
  ListItem,
  Body,
  Fab,
  Icon,
  Spinner,
} from 'native-base'
import { useNavigation } from '@react-navigation/native'

import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'

import ColorConstants from '../util/ColorConstants'
import { fetchEvents } from '../app/eventSlice'
import ToastAlert from '../components/ToastAlert'
import Constants from '../util/Constants'
import EmptyStateView from './EmptyStateView'

const EventsTab = ({ trailData }) => {
  const isAuth = useSelector((state) => state.user.isAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [didFinishRequest, setDidFinishRequest] = useState(false)
  const [events, setEvents] = useState([])

  const dispatch = useDispatch()
  const navigation = useNavigation()

  const displayCreateEventScreen = () => {
    if (isAuth) {
      navigation.navigate('CreateEvent', {
        trailID: trailData._id,
        trailName: trailData.name,
      })
    } else {
      navigation.navigate('Authentication', { screen: 'Signin' })
    }
  }

  const getEvents = async () => {
    setIsLoading(true)
    try {
      const results = await dispatch(fetchEvents(trailData._id))
      const uResults = unwrapResult(results)
      setDidFinishRequest(true)
      setIsLoading(false)
      setEvents(uResults.data)
    } catch (e) {
      console.log(e)
      ToastAlert(e.message)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getEvents()
    })
    getEvents()
    return unsubscribe
  }, [navigation])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ColorConstants.DWhite,
        justifyContent: 'center',
      }}
    >
      {didFinishRequest && events.length > 0 ? (
        <Fab
          direction='up'
          containerStyle={{}}
          style={{ backgroundColor: ColorConstants.primary }}
          position='bottomRight'
          onPress={displayCreateEventScreen}
        >
          <Icon name='add' />
        </Fab>
      ) : (
        <></>
      )}

      {!isLoading && didFinishRequest && events.length == 0 ? (
        <EmptyStateView
          icon={'shoe-prints'}
          title={'No events here so far'}
          description={
            'Be the first one to create an event in this trail and invite other people to join you.'
          }
          buttonTitle={'Create Event'}
          onPress={displayCreateEventScreen}
        />
      ) : (
        <></>
      )}

      {isLoading ? (
        <Spinner color={ColorConstants.primary} />
      ) : (
        <List>
          <FlatList
            style={{ marginBottom: 60 }}
            data={events}
            keyExtractor={(item) => {
              return item._id
            }}
            renderItem={
              ({ item }) => {
                // if (!moment(item.date).isBefore(moment(), 'day')) {
                return (
                  <ListItem
                    onPress={() => {
                      navigation.navigate('ViewEvent', {
                        eventID: item._id,
                      })
                    }}
                    noIndent
                    style={{ backgroundColor: ColorConstants.DWhite }}
                  >
                    <Body>
                      <Text style={styles.listText}>{item.title}</Text>
                      <Text note style={styles.listText}>
                        {item.description}
                      </Text>
                    </Body>
                  </ListItem>
                )
              }
              // }
            }
          />
        </List>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.Black2,
  },
})

export default EventsTab
