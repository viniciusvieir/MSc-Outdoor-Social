import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  ScrollView,
  FlatList,
} from "react-native";
import { Tile } from "react-native-elements";
import moment from "moment";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Button, Text, Thumbnail } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";

import ColorConstants from "../util/ColorConstants";

const ViewEventScreen = ({ navigation, route }) => {
  const list = [
    {
      id: 1,
      name: "Dejan Lovren",
    },
    {
      id: 2,
      name: "Nathaniel Clyne",
    },
    {
      id: 3,
      name: "Simon Mignolet",
    },
    {
      id: 4,
      name: "Dejan Lovren",
    },
    {
      id: 5,
      name: "Nathaniel Clyne",
    },
    {
      id: 6,
      name: "Simon Mignolet",
    },
    {
      id: 7,
      name: "Dejan Lovren",
    },
  ];

  const { trailData, eventData } = route.params || {};
  let eventWeather;
  if (trailData && eventData) {
    eventWeather = trailData.weatherData.daily.find(
      (item) =>
        moment(item * 1000)
          .format("DD/MM/YYYY")
          .toString() === moment(eventData.date).format("DD/MM/YYYY").toString()
    );
  }
  // console.log(eventWeather);
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: ColorConstants.LGreen }}>
        {trailData && eventData ? (
          <>
            <View>
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
                  // key={index}
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
                  style={{ borderRadius: 50 }}
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

            {/* <Row> */}
            <Text
              style={[
                styles.textInfo,
                { fontSize: 30, fontWeight: "500", marginLeft: 10 },
              ]}
            >
              {eventData.title}
            </Text>
            {/* </Row> */}
            <Grid
              style={{
                backgroundColor: ColorConstants.LGreen,
                margin: 10,
                flex: 0.8,
              }}
            >
              <Row>
                <Col size={2}>
                  <Text style={styles.textInfoLabel}>Difficulty</Text>
                  <Text style={styles.textInfo}>{trailData.difficulty}</Text>
                </Col>
                <Col size={2}>
                  <Text style={styles.textInfoLabel}>Length</Text>
                  <Text style={styles.textInfo}>{trailData.length_km} km</Text>
                </Col>
                <Col size={1}>
                  <Text style={styles.textInfoLabel}>Est Time</Text>
                  <Text style={styles.textInfo}>
                    {moment
                      .utc()
                      .startOf("day")
                      .add({ minutes: trailData.estimate_time_min })
                      .format("H:mm")}{" "}
                    hr
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col size={60}>
                  <Text style={styles.textInfoLabel}>Location</Text>
                  <Text style={styles.textInfo}>{trailData.location}</Text>
                </Col>
                <Col size={40}>
                  <Text style={styles.textInfoLabel}>Date</Text>
                  <Text style={styles.textInfo}>
                    {moment(eventData.date).format("DD/MM/YYYY")}
                  </Text>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Text style={styles.textInfoLabel}>Duration</Text>
                  <Text style={styles.textInfo}>
                    {moment
                      .utc()
                      .startOf("day")
                      .add({ minutes: eventData.duration_min })
                      .format("H:mm")}{" "}
                    hr
                  </Text>
                </Col>
                <Col>
                  <Text style={styles.textInfoLabel}>Max People</Text>
                  <Text style={styles.textInfo}>
                    {eventData.max_participants}
                  </Text>
                </Col>
              </Row>
              <View
                style={{
                  marginBottom: 10,
                  borderBottomColor: ColorConstants.White,
                  borderBottomWidth: 1,
                }}
              />
              <Button block style={{ backgroundColor: ColorConstants.Yellow }}>
                <Text style={{ color: ColorConstants.Black }}>Join</Text>
              </Button>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  borderBottomColor: ColorConstants.White,
                  borderBottomWidth: 1,
                }}
              />
            </Grid>

            <Text style={[styles.textInfoLabel, { marginLeft: 10 }]}>
              Description
            </Text>

            <Text style={[styles.textInfoDescription, { marginLeft: 10 }]}>
              {eventData.description}
            </Text>

            {/* <Text></Text>
            <Text>{eventData.createdAt}</Text> */}
            {/* <Text></Text>
            <Text>{trailData.activity_type}</Text> */}
            {/* <Text>{JSON.stringify(trailData.start)}</Text> */}
            <Text>{JSON.stringify(eventWeather)}</Text>
          </>
        ) : null}
        <View
          style={{
            backgroundColor: ColorConstants.Black,
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
          data={list}
          keyExtractor={(item) => {
            return item.id.toString();
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
                <Text style={{ color: ColorConstants.DWhite, fontSize: 18 }}>
                  {item.name}
                </Text>
              </View>
            );
          }}
        />
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
    color: ColorConstants.DWhite,
    fontSize: 20,
  },
  textInfoLabel: {
    fontSize: 12,
    color: ColorConstants.DWhite,
  },
  textInfoDescription: {
    color: ColorConstants.DWhite,
    fontSize: 15,
  },
});

export default ViewEventScreen;
