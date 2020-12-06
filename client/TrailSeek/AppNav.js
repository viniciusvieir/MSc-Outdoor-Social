import React, { useEffect, useState } from 'react'
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import moment from 'moment'
// import { Octicons } from '@expo/vector-icons'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppLoading } from 'expo'
import { Root, Button, Text } from 'native-base'
import { Host } from 'react-native-portalize'
import * as Font from 'expo-font'
import * as Linking from 'expo-linking'

import { leaveEvent } from './src/app/eventSlice'
import ColorConstants from './src/util/ColorConstants'
import { fetchUserData, getToken, logOut } from './src/app/userSlice'
import CreateEventScreen from './src/screens/CreateEventScreen'
import ViewEventScreen from './src/screens/ViewEventScreen'
import ViewTrailScreen from './src/screens/ViewTrailScreen'
import EditEventScreen from './src/screens/EditEventScreen'
import EditProfileScreen from './src/screens/EditProfileScreen'
import ListEventScreen from './src/screens/ListEventScreen'
import ListTrailScreen from './src/screens/ListTrailScreen'
import MyEventScreen from './src/screens/MyEventScreen'
import SearchTrailScreen from './src/screens/SearchTrailScreen'
import SigninScreen from './src/screens/SigninScreen'
import SignupScreen from './src/screens/SignupScreen'
import ViewProfileScreen from './src/screens/ViewProfileScreen'
import { unwrapResult } from '@reduxjs/toolkit'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

import { LogBox } from 'react-native' //Remove after demo
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message//Remove after demo
LogBox.ignoreAllLogs() //Remove after demo

const AuthenticationFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ headerTransparent: true, title: '' }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerTransparent: true, title: '', headerLeft: null }}
      />
    </Stack.Navigator>
  )
}

const ProfileFlow = () => {
  const isAuth = useSelector((state) => state.user.isAuth)

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: ColorConstants.primary },
          headerLeft: null,
          headerStyle: { backgroundColor: ColorConstants.primary },
          headerTitleStyle: { color: ColorConstants.DWhite },
          title: 'My Profile',
          headerRight: () =>
            isAuth ? (
              <TouchableOpacity
                onPress={({}) => {
                  navigation.navigate('EditProfile')
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={24}
                  style={{ color: '#ffffff', marginRight: 20 }}
                />
              </TouchableOpacity>
            ) : null,
          // headerTintColor: ColorConstants.Black,
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerStyle: { backgroundColor: ColorConstants.primary },
          headerTitleStyle: { color: ColorConstants.DWhite },
          title: 'Edit Profile',
          headerBackImage: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="white"
              style={styles.shadow}
            />
          ),
        }}
      />
    </Stack.Navigator>
  )
}

const TrailFlow = () => {
  const autFlag = useSelector((state) => state.user.isAuth)
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchTrail"
        component={SearchTrailScreen}
        options={{
          headerLeft: null,
          title: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="ListTrail"
        component={ListTrailScreen}
        options={({ route }) => ({
          headerStyle: { backgroundColor: ColorConstants.primary },
          headerTitleStyle: { color: ColorConstants.DWhite },
          headerBackImage: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="white"
              style={styles.shadow}
            />
          ),
          title: route.params.title ? route.params.title : 'Search',
        })}
      />
      <Stack.Screen
        name="ViewTrail"
        component={ViewTrailScreen}
        options={() => ({
          title: '',
          headerTransparent: true,
          headerTintColor: ColorConstants.DWhite,
          headerBackImage: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={ColorConstants.DWhite}
              style={styles.shadow}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          headerStyle: { backgroundColor: ColorConstants.primary },
          headerTitleStyle: { color: ColorConstants.DWhite },
          headerTintColor: ColorConstants.DWhite,
          title: 'Create Event',
          headerBackImage: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="white"
              style={styles.shadow}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: (e) => {
            autFlag
              ? null
              : navigation.navigate('Authentication', { screen: 'Signin' })
          },
        })}
      />
      <Stack.Screen name="ListEvent" component={ListEventScreen} />
    </Stack.Navigator>
  )
}

const EventFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyEvent"
        component={MyEventScreen}
        options={{
          headerStyle: { backgroundColor: ColorConstants.primary },
          headerLeft: null,
          headerTitleStyle: { color: ColorConstants.DWhite },
          title: 'My Events',
          // headerTintColor: ColorConstants.Black,
        }}
      />
    </Stack.Navigator>
  )
}

const MainTabFlow = () => {
  const autFlag = useSelector((state) => state.user.isAuth)
  return (
    <Tab.Navigator
      initialRouteName="TrailFlow"
      tabBarOptions={{
        activeTintColor: ColorConstants.secondary,
        inactiveTintColor: ColorConstants.darkGray,
        inactiveBackgroundColor: ColorConstants.White,
        activeBackgroundColor: ColorConstants.White,
        tabStyle: {
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="TrailFlow"
        component={TrailFlow}
        options={({ route }) => ({
          tabBarVisible:
            getFocusedRouteNameFromRoute(route) === 'ViewTrail' ||
            getFocusedRouteNameFromRoute(route) === 'CreateEvent'
              ? false
              : true,
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="EventFlow"
        component={EventFlow}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (autFlag) {
              return null
            } else {
              e.preventDefault()
              navigation.navigate('Authentication', { screen: 'Signin' })
            }
          },
        })}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileFlow"
        component={ProfileFlow}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (autFlag) {
              return null
            } else {
              e.preventDefault()
              navigation.navigate('Authentication', { screen: 'Signin' })
            }
          },
        })}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={24} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditProfile', { id: route.params.id })
              }}
            >
              <Ionicons
                name="md-create"
                size={30}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  )
}
const prefix = Linking.makeUrl('/')
// const url1 = async () => {}
// url1()

const AppNav = () => {
  // console.log(prefix.substring(6))
  const dispatch = useDispatch()
  // const [initRoutName, setInitRoutName] = useState(null)
  // const autFlag = useSelector((state) => state.user.isAuth)
  const [isLoading, setIsLoading] = useState(true)
  const userId = useSelector((state) => state.user.profile.id)
  const currentEventUserID = useSelector((state) =>
    state.event.currentEvent.length
      ? state.event.currentEvent[0].eventData.userId
      : null
  )
  const currentEventParticipants = useSelector((state) =>
    state.event.currentEvent.length
      ? state.event.currentEvent[0].eventData.participants
      : null
  )
  const trailID = useSelector((state) =>
    state.event.currentEvent.length
      ? state.event.currentEvent[0].eventData.trailId
      : null
  )
  const eventID = useSelector((state) =>
    state.event.currentEvent.length
      ? state.event.currentEvent[0].eventData._id
      : null
  )
  const eventDate = useSelector((state) =>
    state.event.currentEvent.length
      ? state.event.currentEvent[0].eventData.date
      : null
  )

  const linking = {
    // prefixes: [prefix.substring(6)],
    // config: {
    //   screens: {
    //     ViewEvent: {
    //       path: '/ViewEvent',
    //       parse: {
    //         eventID: (eventID) => eventID,
    //       },
    //     },
    //   },
    //   // ViewEvent: '/ViewEvent/:eventID',
    // },
  }

  // const linking = {
  //   prefixes: [prefix.substring(6)],
  //   config: {
  //     ViewEvent: '/ViewEvent/:eventID',
  //   },
  // }

  const getAsyncTokenAndUserData = async () => {
    try {
      await Font.loadAsync({
        Roboto: require('./node_modules/native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('./node_modules/native-base/Fonts/Roboto_medium.ttf'),
      })
      const results = await dispatch(getToken())
      unwrapResult(results)
      const results1 = await dispatch(fetchUserData())
      unwrapResult(results1)
      return results1
    } catch (e) {
      dispatch(logOut())
      console.log(e.message)
    }
  }

  if (isLoading && Platform.OS != 'ios') {
    return (
      <AppLoading
        startAsync={getAsyncTokenAndUserData}
        onFinish={() => {
          // autFlag
          //   ? setInitRoutName('MainTab')
          //   : setInitRoutName('Authentication')
          setIsLoading(false)
        }}
        onError={console.warn}
      />
    )
  }

  return (
    <Root>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Host>
          <Stack.Navigator initialRouteName="MainTab">
            <Stack.Screen
              name="MainTab"
              component={MainTabFlow}
              options={{
                headerShown: false,
                headerRight: null,
              }}
            />
            <Stack.Screen
              name="ViewEvent"
              component={ViewEventScreen}
              options={({ navigation, route }) => ({
                title: '',
                headerTransparent: true,
                headerBackImage: () => (
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="#000000"
                    style={styles.shadow}
                  />
                ),
                headerRight: () => {
                  if (!moment(eventDate).isBefore(moment(), 'day')) {
                    if (userId === currentEventUserID) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('EditEvent')
                          }}
                        >
                          <MaterialIcons
                            name="edit"
                            size={24}
                            style={{ color: '#000000', marginRight: 20 }}
                          />
                        </TouchableOpacity>
                      )
                    } else if (
                      currentEventParticipants?.findIndex((item) => {
                        return item.userId === userId
                      }) !== -1
                    ) {
                      return (
                        <Button
                          danger
                          rounded
                          onPress={async () => {
                            try {
                              const res = await dispatch(
                                leaveEvent({ trailID, eventID })
                              )
                              unwrapResult(res)
                              route.params.refresh()
                            } catch (e) {
                              console.log(e.message)
                            }
                          }}
                          style={{ marginRight: 10, height: 25, width: 65 }}
                        >
                          <Text style={{ fontSize: 10 }}>Leave</Text>
                        </Button>
                        // <TouchableOpacity
                        //   onPress={() => {
                        //     navigation.navigate("EditEvent");
                        //   }}
                        // >
                        //   <Octicons
                        //     name="kebab-vertical"
                        //     size={24}
                        //     color="#000000"
                        //     style={{ marginRight: 20 }}
                        //   />
                        // </TouchableOpacity>
                      )
                    } else return null
                  } else return null
                },
              })}
            />
            <Stack.Screen
              name="EditEvent"
              component={EditEventScreen}
              options={{
                headerStyle: { backgroundColor: ColorConstants.primary },
                headerTitleStyle: { color: ColorConstants.DWhite },
                title: 'Edit Events',
                headerBackImage: () => (
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="white"
                    style={styles.shadow}
                  />
                ),
                // headerTintColor: ColorConstants.Black,
              }}
            />
            <Stack.Screen
              name="Authentication"
              component={AuthenticationFlow}
              options={{ headerTransparent: true, title: '', headerLeft: null }}
            />
          </Stack.Navigator>
        </Host>
      </NavigationContainer>
    </Root>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      height: 1, // i.e. the shadow has to be offset in some way
    },
  },
})

export default AppNav
