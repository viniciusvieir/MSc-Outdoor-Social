import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  ScrollView,
  FlatList,
} from "react-native";
import moment from "moment";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Button, Text, Thumbnail } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import ColorConstants from "../util/ColorConstants";
import { updateCurrentEvent, joinEvent } from "../app/eventSlice";
import Constants from "../util/Constants";
import ToastAlert from "../components/ToastAlert";

const ViewEventScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.user.profile.id);
  const { trailData, eventData } = route.params || {};

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(updateCurrentEvent({ eventData, trailName: trailData.name }));
    });
    return unsubscribe;
  }, [navigation]);

  let eventWeather;
  if (trailData && eventData) {
    eventWeather = trailData.weatherData.daily.find(
      (item) =>
        moment(item * 1000)
          .format("DD/MM/YYYY")
          .toString() === moment(eventData.date).format("DD/MM/YYYY").toString()
    );
  }
  const findUserInParticipants = (item) => {
    return item._id === userID;
  };
  // console.log(eventWeather);
  return (
    <>
      <ScrollView
        style={{
          backgroundColor: ColorConstants.DWhite,
          flex: 1,
        }}
      >
        {trailData && eventData ? (
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
                  title={"You Meet Here"}
                  // description={marker.description}
                />
              </MapView>
              <View
                style={{
                  position: "absolute", //use absolute position to show button on top of the map
                  top: "95%", //for center align
                  right: 10,
                  alignSelf: "flex-end", //for align to right
                }}
              >
                <Button
                  style={{
                    borderRadius: 50,
                    backgroundColor: ColorConstants.secondary,
                  }}
                  onPress={() => {
                    const scheme = Platform.select({
                      ios: "maps:0,0?q=",
                      android: "geo:0,0?q=",
                    });
                    const latLng = `${trailData.start.coordinates[0]},${trailData.start.coordinates[1]}`;
                    const label = `${trailData.name}`;
                    const url = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`,
                    });

                    Linking.openURL(url);
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
                      fontWeight: "bold",
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
                      {moment(eventData.date).format("DD/MM/YYYY")}
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
                <Col>
                  <Row>
                    <FontAwesome5 name="male" size={24} color="black" />

                    <Text style={styles.textInfo}>
                      {eventData.max_participants}
                    </Text>
                  </Row>
                </Col>
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
                        .startOf("day")
                        .add({ minutes: trailData.estimate_time_min })
                        .format("H[h]mm")}
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
              {userID === eventData.userId ||
              eventData.participants.findIndex(findUserInParticipants) != -1 ||
              eventData.participants.length >=
                eventData.max_participants ? null : (
                <>
                  <View
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                      borderBottomColor: ColorConstants.darkGray,
                      borderBottomWidth: 1,
                    }}
                  />

                  <Button
                    block
                    style={{ backgroundColor: ColorConstants.Yellow }}
                    onPress={async () => {
                      try {
                        const response = await dispatch(
                          joinEvent({
                            trailID: eventData.trailId,
                            eventID: eventData._id,
                          })
                        );
                        navigation.goBack();
                      } catch (e) {
                        ToastAlert(e.message);
                      }
                    }}
                  >
                    <Text style={{ color: ColorConstants.Black }}>Join</Text>
                  </Button>
                </>
              )}
            </Grid>
            {/* <Text>{JSON.stringify(eventWeather)}</Text> */}

            <View
              style={{
                backgroundColor: ColorConstants.Black + 40,
                alignItems: "center",
                justifyContent: "center",
                height: 50,
              }}
            >
              <Text
                style={{
                  color: ColorConstants.DWhite,
                  fontSize: 22,
                }}
              >
                Other Participants
              </Text>
            </View>
            <FlatList
              data={eventData.participants}
              keyExtractor={(item) => {
                return item.userId.toString();
              }}
              style={{
                marginVertical: 10,
              }}
              horizontal
              renderItem={({ item }) => {
                return (
                  <View style={{ marginLeft: 10, alignItems: "center" }}>
                    <Thumbnail
                      style={{
                        borderColor: ColorConstants.DGreen,
                        borderWidth: 3,
                        height: 100,
                        width: 100,
                      }}
                      large
                      source={{
                        uri: `https://eu.ui-avatars.com/api/?name=${item.name}`,
                      }}
                    />
                    <Text style={{ color: ColorConstants.Black, fontSize: 18 }}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
          </>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    // margin: 10,
    width: Dimensions.get("window").width,
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
});

export default ViewEventScreen;
