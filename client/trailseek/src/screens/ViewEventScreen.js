import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  // ScrollView,
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
  Footer,
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
} from '../app/eventSlice'
import { fetchTrailsByID } from '../app/trailSlice'
// import { addJoinedEvent } from '../app/userSlice'
import Constants from '../util/Constants'
import ToastAlert from '../components/ToastAlert'

const ViewEventScreen = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user.profile.id)
  const isAuth = useSelector((state) => state.user.isAuth)
  // const name = useSelector((state) => state.user.profile.name)
  const [joinFlag, setJoinFlag] = useState(false)
  const { eventID } = route.params || {}
  const [eventData, setEventData] = useState({})
  const [trailData, setTrailData] = useState({})
  // console.log(trailData)
  const getSingleEvent = async () => {
    try {
      const response = await dispatch(fetchSingleEvent(eventID))
      const uResult = unwrapResult(response)
      setEventData(uResult)
      const fields =
        'name,location,path,bbox,difficulty,length_km,activity_type,estimate_time_min,start'
      const id = uResult.trailId
      const responseTrails = await dispatch(
        fetchTrailsByID({
          fields,
          id,
        })
      )
      const uResultTrails = unwrapResult(responseTrails)
      setTrailData(uResultTrails)
      dispatch(
        updateCurrentEvent({ eventData: uResult, trailName: trailData.name })
      )

      // console.log(eventData);
      if (userId !== uResult.userId) {
        if (uResult.participants.length < uResult.max_participants) {
          if (
            uResult.participants.findIndex((item) => {
              return item.userId === userId
            }) === -1
          ) {
            setJoinFlag(true)
          }
        }
      }
    } catch (e) {
      Toast.show({ text: e.message, type: 'danger', duration: 2000 })
    }
  }

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
                borderBottomWidth: 2,
                borderBottomColor: ColorConstants.Black2,
              }}
            >
              <MapView
                style={styles.mapStyle}
                initialRegion={{
                  latitude: trailData.start.coordinates[0],
                  longitude: trailData.start.coordinates[1],
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.0121,
                }}
                provider="google"
                mapType="terrain"
                loadingEnabled
                zoomEnabled={false}
                zoomTapEnabled={false}
                zoomControlEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}
                pitchEnabled={false}
              >
                <Polyline
                  coordinates={trailData.path}
                  strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={3}
                />
                <Marker
                  coordinate={{
                    latitude: trailData.start.coordinates[0],
                    longitude: trailData.start.coordinates[1],
                  }}
                  title={'You Meet Here'}
                  // description={marker.description}
                />
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
                  <Text>Navigate</Text>
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
                <Entypo name="location-pin" size={16} color="gray" />
                <Text style={{ fontSize: 14 }}>{trailData.location}</Text>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col>
                  <Row>
                    <FontAwesome5 name="calendar-alt" size={24} color="black" />
                    <Text style={styles.textInfo}>
                      {moment(eventData.date).format('DD/MM/YYYY')}
                    </Text>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <FontAwesome5 name="male" size={24} color="black" />
                    <Text style={styles.textInfo}>
                      {eventData.max_participants}
                    </Text>
                  </Row>
                </Col>
                {/* <Col>
                  <Text style={styles.textInfoLabel}>Duration</Text>
                  <Text style={styles.textInfo}>
                    {moment
                      .utc()
                      .startOf("day")
                      .add({ minutes: eventData.duration_min })
                      .format("H:mm")}{" "}
                    hr
                  </Text>
                </Col> */}
              </Row>

              <Row style={{ marginTop: 16 }}>
                <Col size={1}>
                  <Row>
                    <FontAwesome5
                      name="hiking"
                      size={20}
                      color={ColorConstants.Black2}
                    />
                    <Text style={styles.textInfo}>
                      {trailData.activity_type}
                    </Text>
                  </Row>
                </Col>
                <Col size={1}>
                  <Row>
                    <FontAwesome5
                      name="mountain"
                      size={16}
                      color={ColorConstants.Black2}
                    />
                    <Text style={styles.textInfo}>{trailData.difficulty}</Text>
                  </Row>
                </Col>
                <Col size={1}>
                  <Row>
                    <FontAwesome5
                      name="route"
                      size={20}
                      color={ColorConstants.Black2}
                    />
                    <Text style={styles.textInfo}>
                      {trailData.length_km} km
                    </Text>
                  </Row>
                </Col>
                <Col size={1}>
                  <Row>
                    <FontAwesome5
                      name="clock"
                      size={20}
                      color={ColorConstants.Black2}
                    />
                    <Text style={styles.textInfo}>
                      {moment
                        .utc()
                        .startOf('day')
                        .add({ minutes: trailData.estimate_time_min })
                        .format('H[h]mm')}
                    </Text>
                  </Row>
                </Col>
              </Row>

              <View
                style={{
                  marginTop: 16,
                  borderBottomColor: ColorConstants.darkGray,
                  borderBottomWidth: 1,
                }}
              />

              <Row style={{ marginTop: 16 }}>
                <Text style={styles.textInfoDescription}>
                  {eventData.description}
                </Text>
              </Row>
            </Grid>
            {/* <Text>{JSON.stringify(eventWeather)}</Text> */}

            <View>
              <Text
                style={{
                  color: ColorConstants.Black,
                  fontSize: 16,
                  marginHorizontal: Constants.POINTS.marginHorizontal,
                }}
              >
                Participants ({eventData.participants.length})
              </Text>
            </View>
            <FlatList
              horizontal
              data={eventData.participants}
              keyExtractor={(item) => {
                return item.userId.toString()
              }}
              style={{ marginTop: 12 }}
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
                  <View style={{ alignItems: 'center' }}>
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
                    <Text style={{ color: ColorConstants.Black, fontSize: 10 }}>
                      {item.name}
                    </Text>
                  </View>
                )
              }}
            />
          </>
        ) : null}
      </Content>
      <Footer
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
                        setJoinFlag(false)

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
                    {userId !== eventData.userId ? (
                      <Text style={{ fontSize: 18, marginTop: 5 }}>
                        You are going!
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
                    }}
                  >
                    <FontAwesome5 name="share-alt" size={20} color="black" />
                    <Text style={{ color: ColorConstants.Black }}>Share</Text>
                  </Button>
                </View>
              </>
            )}
          </View>
        )}
      </Footer>
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
