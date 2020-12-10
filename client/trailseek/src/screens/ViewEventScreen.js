import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  FlatList,
  Share,
} from 'react-native'
import moment from 'moment'
import MapView, { Marker, Polyline } from 'react-native-maps'
import {
  Button,
  Text,
  Thumbnail,
  Toast,
  Container,
  Content,
  Switch,
  Icon,
  Right,
  Spinner,
} from 'native-base'
import { Grid, Col, Row } from 'react-native-easy-grid'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import * as ExpoLinking from 'expo-linking'
import { FontAwesome5 } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'

import ColorConstants from '../util/ColorConstants'
import {
  updateCurrentEvent,
  joinEvent,
  fetchSingleEvent,
  leaveEvent,
} from '../app/eventSlice'
import { fetchTrailsByID } from '../app/trailSlice'
import Constants from '../util/Constants'
import ToastAlert from '../components/ToastAlert'
import CalendarView from '../components/CalendarView'

const ViewEventScreen = ({ route, navigation }) => {
  const { eventID } = route.params || {}
  const dispatch = useDispatch()

  const isAuth = useSelector((state) => state.user.isAuth)
  const userId = useSelector((state) => state.user.profile.id)
  // const name = useSelector((state) => state.user.profile.name)

  const [region, setRegion] = useState({})

  const [eventData, setEventData] = useState({})
  const [trailData, setTrailData] = useState({})

  const [isEventAvailable, setIsEventAvailable] = useState(true)

  const [hasJoined, setHasJoined] = useState(false)
  const [isEventOwner, setIsEventOwner] = useState(false)
  const [isLoadingJoinButton, setIsLoadingJoinButton] = useState(false)

  const [isSharingLocation, setIsSharingLocation] = useState(false)
  const [userLocations, setUserLocations] = useState([])

  const getSingleEvent = async () => {
    try {
      const response = await dispatch(fetchSingleEvent(eventID))
      const uResult = unwrapResult(response)
      setEventData(uResult)

      setIsEventAvailable(!moment(uResult.date).isBefore(moment(), 'day'))

      setHasJoined(
        isAuth &&
          uResult.participants &&
          uResult.participants.some((el) => el.userId === userId)
      )
      setIsEventOwner(
        isAuth &&
          uResult.participants &&
          uResult.participants.length > 0 &&
          uResult.participants[0].userId === userId
      )

      const fields =
        'name,location,path,bbox,difficulty,length_km,activity_type,duration_min,start'
      const id = uResult.trailId
      const responseTrails = await dispatch(
        fetchTrailsByID({
          fields,
          id,
        })
      )
      const uResultTrails = unwrapResult(responseTrails)
      setTrailData(uResultTrails)
      setRegion(regionContainingPoints(uResultTrails.path))

      dispatch(
        updateCurrentEvent({ eventData: uResult, trailName: trailData.name })
      )
    } catch (e) {
      Toast.show({ text: e.message, type: 'danger', duration: 2000 })
    }
  }

  const openChatScreen = () =>
    navigation.navigate('Chat', { eventId: eventData._id })

  const joinEventAction = async () => {
    if (isAuth) {
      try {
        setIsLoadingJoinButton(true)
        const response = await dispatch(
          joinEvent({
            trailID: trailData._id,
            eventID,
          })
        )
        const h = unwrapResult(response)
        getSingleEvent()
        navigation.s

        setHasJoined(true)
        setIsLoadingJoinButton(false)
      } catch (e) {
        ToastAlert(e.message)
      }
    } else {
      navigation.navigate('Authentication', {
        screen: 'Signin',
      })
    }
  }

  const leaveEventAction = async () => {
    if (!isAuth) return

    setIsLoadingJoinButton(true)
    const res = await dispatch(leaveEvent({ trailID: trailData._id, eventID }))
    unwrapResult(res)

    getSingleEvent()

    setHasJoined(false)
    setIsLoadingJoinButton(false)
  }

  const shareEvent = async () => {
    try {
      const result = await Share.share({
        title: 'Share Event',
        message: `Check out this event from Trailseek!\n${ExpoLinking.makeUrl(
          '/ViewEvent',
          {
            eventID: eventData._id,
          }
        ).substring(6)}`,
        url: `${ExpoLinking.makeUrl('/ViewEvent', {
          eventID: eventData._id,
        }).substring(6)}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const changeSharingLocation = () => {
    if (isSharingLocation) {
      // turn off location sharing
      setUserLocations([])
    } else {
      // turn on location sharing

      // add current location to map
      const currentLocation =
        trailData.path[Math.floor(Math.random() * trailData.path.length)]
      setUserLocations((old) => [...old, currentLocation])
    }

    setIsSharingLocation((previousValue) => !previousValue)
  }

  // https://stackoverflow.com/questions/32557474/how-to-calculate-delta-latitude-and-longitude-for-mapview-component-in-react-nat
  const regionContainingPoints = (points) => {
    let minLat,
      maxLat,
      minLng,
      maxLng

      // init first point
    ;((point) => {
      minLat = point.latitude
      maxLat = point.latitude
      minLng = point.longitude
      maxLng = point.longitude
    })(points[0])

    // calculate rect
    points.forEach((point) => {
      minLat = Math.min(minLat, point.latitude)
      maxLat = Math.max(maxLat, point.latitude)
      minLng = Math.min(minLng, point.longitude)
      maxLng = Math.max(maxLng, point.longitude)
    })

    const midLat = (minLat + maxLat) / 2
    const midLng = (minLng + maxLng) / 2

    const deltaLat = maxLat - minLat
    const deltaLng = maxLng - minLng

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat * 1.25,
      longitudeDelta: deltaLng * 1.25,
    }
  }

  const addLocationMarkers = () => {}

  useEffect(() => {
    navigation.setParams({ refresh: () => getSingleEvent() })
    const unsubscribe = navigation.addListener('focus', async () => {
      getSingleEvent()
    })
    getSingleEvent()
    // setParticipants(eventData.participants)
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const getTrailData = async () => {}
    getTrailData()
  }, [])

  // let eventWeather
  // if (trailData && eventData) {
  //   // eventWeather = trailData.weatherData.daily.find(
  //   //   (item) =>
  //   //     moment(item * 1000)
  //   //       .format('DD/MM/YYYY')
  //   //       .toString() === moment(eventData.date).format('DD/MM/YYYY').toString()
  //   // )
  // }

  // console.log(eventWeather);

  const userMarkers = userLocations.map((location) => (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      title={'me'}
    >
      <Thumbnail
        style={{
          borderColor: ColorConstants.DGreen,
          borderWidth: 1,
          height: 30,
          width: 30,
        }}
        large
        source={{ uri: 'https://eu.ui-avatars.com/api/?name=$test' }}
      />
    </Marker>
  ))

  return (
    <Container>
      <Content
        style={{
          backgroundColor: ColorConstants.DWhite,
          flex: 1,
        }}
      >
        {JSON.stringify(trailData) !== '{}' &&
        JSON.stringify(eventData) !== '{}' ? (
          <>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: ColorConstants.Black2,
              }}
            >
              <MapView
                style={styles.mapStyle}
                // initialRegion={{
                //   latitude: trailData.start.coordinates[0],
                //   longitude: trailData.start.coordinates[1],
                //   latitudeDelta: 0.5,
                //   longitudeDelta: 0.5,
                // }}
                region={region}
                provider='google'
                mapType='terrain'
                loadingEnabled
                zoomEnabled={true}
                zoomTapEnabled={true}
                zoomControlEnabled={false}
                rotateEnabled={false}
                scrollEnabled={true}
                pitchEnabled={true}
              >
                <Polyline
                  coordinates={trailData.path}
                  strokeColor='#000' // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={3}
                />
                <Marker
                  coordinate={{
                    latitude: trailData.start.coordinates[0],
                    longitude: trailData.start.coordinates[1],
                  }}
                  title={'You Meet Here'}
                  // image={'https://placeimg.com/140/140/any'}
                  // description={marker.description}
                />
                {userMarkers}
              </MapView>
              <View
                style={{
                  position: 'absolute', //use absolute position to show button on top of the map
                  top: '95%', //for center align
                  right: 10,
                  alignSelf: 'flex-end', //for align to right
                }}
              >
                <Button
                  style={{
                    borderRadius: 50,
                    backgroundColor: ColorConstants.secondary,
                  }}
                  onPress={() => {
                    const scheme = Platform.select({
                      ios: 'maps:0,0?q=',
                      android: 'geo:0,0?q=',
                    })
                    const latLng = `${trailData.start.coordinates[0]},${trailData.start.coordinates[1]}`
                    const label = `${trailData.name}`
                    const url = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`,
                    })

                    Linking.openURL(url)
                  }}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: 'bold' }}
                    uppercase={false}
                  >
                    Navigate
                  </Text>
                </Button>
              </View>
            </View>
            <Grid style={{ padding: Constants.POINTS.marginHorizontal }}>
              <Row>
                <Col size={3}>
                  <Text
                    style={{
                      color: ColorConstants.primary,
                      fontSize: 26,
                      fontWeight: 'bold',
                    }}
                  >
                    {eventData.title}
                  </Text>
                </Col>
              </Row>
              <Row>
                <Entypo name='location-pin' size={16} color='gray' />
                <Text style={{ fontSize: 14, marginRight: 20 }}>
                  {trailData.name} • {trailData.location}
                </Text>
              </Row>

              <Row style={{ marginTop: 20, alignItems: 'center' }}>
                <CalendarView
                  date={eventData.date}
                  eventDuration={eventData.duration_min}
                />

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 32,
                  }}
                >
                  <FontAwesome5 name='users' size={18} color='black' />
                  <Text style={{ ...styles.textInfo, marginLeft: 8 }}>
                    {eventData.max_participants} people max
                  </Text>
                </View>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>About</Text>
              </Row>

              <Row>
                <Text style={styles.textInfoDescription}>
                  {eventData.description.trim()}
                </Text>
              </Row>

              <Row style={{ flex: 1, marginTop: 20 }}>
                {!isEventOwner && isEventAvailable && (
                  <Col>
                    <Button
                      iconLeft
                      block
                      small
                      disabled={isLoadingJoinButton}
                      onPress={() =>
                        hasJoined ? leaveEventAction() : joinEventAction()
                      }
                      style={{ backgroundColor: ColorConstants.primary }}
                    >
                      {isLoadingJoinButton ? (
                        <Spinner size={12} color={ColorConstants.White} />
                      ) : (
                        <>
                          <Icon name={hasJoined ? 'exit' : 'person-add'} />
                          <Text uppercase={false}>
                            {hasJoined ? 'Leave' : 'Join'}
                          </Text>
                        </>
                      )}
                    </Button>
                  </Col>
                )}

                {isAuth && hasJoined && (
                  <Col>
                    <Button
                      iconLeft
                      block
                      small
                      style={{
                        marginLeft: isEventOwner || !isEventAvailable ? 0 : 8,
                        backgroundColor: ColorConstants.primary,
                      }}
                      onPress={openChatScreen}
                    >
                      <Icon name='chat' type='Entypo' />
                      <Text uppercase={false}>Chat</Text>
                    </Button>
                  </Col>
                )}

                <Col>
                  <Button
                    iconLeft
                    block
                    small
                    style={{
                      marginLeft: 8,
                      backgroundColor: ColorConstants.primary,
                    }}
                    onPress={shareEvent}
                  >
                    <Icon name='share' />
                    <Text uppercase={false}>Share</Text>
                  </Button>
                </Col>
              </Row>

              {/* <Row style={{ marginTop: 20 }}>
                <Text>Enable location tracking</Text>
                <Right>
                  <Switch
                    trackColor={{ true: ColorConstants.primary }}
                    value={isSharingLocation}
                    onValueChange={changeSharingLocation}
                  />
                </Right>
              </Row> */}
            </Grid>
            {/* <Text>{JSON.stringify(eventWeather)}</Text> */}

            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginHorizontal: Constants.POINTS.marginHorizontal,
                }}
              >
                Participants ({eventData.participants.length})
              </Text>

              <FlatList
                horizontal
                data={eventData.participants}
                keyExtractor={(item) => {
                  return item.userId.toString()
                }}
                style={{ marginTop: 6 }}
                contentContainerStyle={{
                  paddingHorizontal: Constants.POINTS.marginHorizontal,
                }}
                ListEmptyComponent={
                  <Text
                    style={{
                      paddingHorizontal: Constants.POINTS.marginHorizontal,
                    }}
                  >
                    No participants
                  </Text>
                }
                renderItem={({ item }) => {
                  return (
                    <View style={{ alignItems: 'center', paddingRight: 8 }}>
                      <Thumbnail
                        style={{
                          borderColor: ColorConstants.DGreen,
                          borderWidth: 1,
                          height: 40,
                          width: 40,
                        }}
                        large
                        source={{
                          uri: item.profileImage
                            ? item.profileImage
                            : `https://eu.ui-avatars.com/api/?name=${item.name}`,
                        }}
                      />
                      <Text
                        style={{
                          marginTop: 2,
                          color: ColorConstants.Black,
                          fontSize: 10,
                          maxWidth: 46,
                          textAlign: 'center',
                        }}
                      >
                        {item.name}
                        {eventData.participants[0]._id === item._id
                          ? ' (hoster)'
                          : ''}
                      </Text>
                    </View>
                  )
                }}
              />
            </View>
          </>
        ) : null}
      </Content>

      {/* <Footer
        style={{
          backgroundColor: '#ffffff',
          height: 60,
        }}
      >
        {moment(eventData.date).isBefore(moment(), 'day') ? (
          <Text style={{ fontSize: 25, marginTop: 5 }}>Event is over</Text>
        ) : (
          <View style={{ flex: 1 }}>
            {joinFlag ? (
              <View style={styles.joinShareButtonView}>
                <Button
                  rounded
                  style={{
                    backgroundColor: ColorConstants.primary,
                  }}
                  onPress={async () => {
                    if (isAuth) {
                      try {
                        const response = await dispatch(
                          joinEvent({
                            trailID: trailData._id,
                            eventID,
                          })
                        )
                        const h = unwrapResult(response)
                        getSingleEvent()
                        navigation.s
                        //Add Modal
                        Toast.show({
                          text: 'Event Joined',
                          buttonText: 'Okay',
                          type: 'success',
                        })

                        // navigation.goBack(); // Comment this
                      } catch (e) {
                        ToastAlert(e.message)
                      }
                    } else {
                      navigation.navigate('Authentication', {
                        screen: 'Signin',
                      })
                    }
                  }}
                >
                  <Text uppercase={false}>Join Event</Text>
                </Button>
              </View>
            ) : (
              <>
                <View style={styles.joinShareButtonView}>
                  <View
                    style={{
                      marginRight: 50,
                    }}
                  >
                    {bottomMessage !== '' ? (
                      <Text style={{ fontSize: 18, marginTop: 5 }}>
                        {bottomMessage}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    style={{
                      backgroundColor: ColorConstants.Yellow,
                      paddingStart: 10,
                    }}
                    onPress={async () => {
                      try {
                        const result = await Share.share({
                          title: 'Share Event',
                          message: `Click on this link to view the event : ${ExpoLinking.makeUrl(
                            '/ViewEvent',
                            {
                              eventID: eventData._id,
                            }
                          )}`,
                          url: `${ExpoLinking.makeUrl('/ViewEvent', {
                            eventID: eventData._id,
                          })}`,
                        })
                        if (result.action === Share.sharedAction) {
                          if (result.activityType) {
                            // shared with activity type of result.activityType
                          } else {
                            // shared
                          }
                        } else if (result.action === Share.dismissedAction) {
                          // dismissed
                        }
                      } catch (error) {
                        alert(error.message)
                      }
                    }}
                  >
                    <FontAwesome5 name='share-alt' size={20} color='black' />
                    <Text style={{ color: ColorConstants.Black }}>Share</Text>
                  </Button>
                </View>
              </>
            )}
          </View>
        )}
      </Footer> */}
    </Container>
  )
}

const styles = StyleSheet.create({
  mapStyle: {
    // margin: 10,
    width: Dimensions.get('window').width,
    height: 400,
  },
  textInfo: {
    marginLeft: 4,
    color: ColorConstants.Black2,
    fontSize: 16,
  },
  textInfoLabel: {
    fontSize: 12,
    color: ColorConstants.darkGray,
  },
  textInfoDescription: {
    color: ColorConstants.darkGray,
    fontSize: 15,
  },
  joinShareButtonView: {
    alignSelf: 'flex-end',
    marginRight: 20,
    flexDirection: 'row',
    marginTop: 10,
  },
})

export default ViewEventScreen
