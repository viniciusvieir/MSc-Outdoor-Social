import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Tab, Tabs, Header } from 'native-base'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import moment from 'moment'

import ColorConstants from '../util/ColorConstants'
import { getUserCreatedEvents, getUserJoinedEvents } from '../app/userSlice'
import MyEventList from '../components/MyEventsList'

const MyEventScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [myEvents, setMyEvents] = useState([])
  const [joinedEvents, setJoinedEvents] = useState([])
  const getUserEvents = async () => {
    try {
      const response = await dispatch(getUserCreatedEvents())
      const response2 = await dispatch(getUserJoinedEvents())
      const uMyEvents = unwrapResult(response)
      setMyEvents(uMyEvents)
      const uJoinedEvents = unwrapResult(response2)
      setJoinedEvents(uJoinedEvents)
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    getUserEvents()
    const unsubscribe = navigation.addListener('focus', () => {
      getUserEvents()
    })
    return unsubscribe
  }, [navigation])

  return (
    <Container style={{ backgroundColor: ColorConstants.DWhite, flex: 1 }}>
      <Header hasTabs style={{ height: 0 }} androidStatusBarColor='#ffffff00' />
      <Tabs
        activeTextStyle={{ color: ColorConstants.secondary }}
        tabBarUnderlineStyle={{ backgroundColor: ColorConstants.White }}
      >
        <Tab
          heading='Upcomming'
          tabStyle={{ backgroundColor: ColorConstants.primary }}
          activeTabStyle={{ backgroundColor: ColorConstants.primary }}
          textStyle={{ color: ColorConstants.White }}
          activeTextStyle={{ color: ColorConstants.White }}
        >
          <View style={{ flex: 1 }}>
            <MyEventList
              data={myEvents.filter(
                (item) => !moment(item.date).isBefore(moment(), 'day')
              )}
              listHeader='Hosted Events'
            />

            <MyEventList
              data={joinedEvents.filter(
                (item) => !moment(item.date).isBefore(moment(), 'day')
              )}
              listHeader='Joined Events'
            />
          </View>
        </Tab>
        <Tab
          heading='Past'
          tabStyle={{ backgroundColor: ColorConstants.primary }}
          activeTabStyle={{ backgroundColor: ColorConstants.primary }}
          textStyle={{ color: ColorConstants.White }}
          activeTextStyle={{ color: ColorConstants.White }}
        >
          <View style={{ flex: 1 }}>
            <MyEventList
              data={myEvents.filter((item) =>
                moment(item.date).isBefore(moment(), 'day')
              )}
              listHeader='Hosted Events'
            />

            <MyEventList
              data={joinedEvents.filter((item) =>
                moment(item.date).isBefore(moment(), 'day')
              )}
              listHeader='Joined Events'
            />
          </View>
        </Tab>
      </Tabs>
    </Container>
  )
}

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.DWhite,
  },
})

export default MyEventScreen
