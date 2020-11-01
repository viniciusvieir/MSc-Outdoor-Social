import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { Text, Button, Tile } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import StarRating from "react-native-star-rating";
import { unwrapResult } from "@reduxjs/toolkit";

import { fetchTrailsByID } from "../app/trailSlice";
import ToastAlert from "../components/ToastAlert";
import LoadSpinner from "../components/LoadSpinner";
import CONSTANTS from "../util/Constants";

const ViewTrailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [trailData, setTrailData] = useState({});
  let spinner = true;
  let content;
  const dispatch = useDispatch();

  const trailStatus = useSelector((state) => state.trails.status);
  const error = useSelector((state) => state.trails.error);
  const fields =
    "name,avg_rating,location,path,bbox,img_url,difficulty,length_km,description,activity_type,estimate_time_min";

  useEffect(() => {
    const getTrailDetail = async () => {
      try {
        const results = await dispatch(fetchTrailsByID({ fields, id }));
        const uResults = unwrapResult(results);
        setTrailData(uResults);
      } catch (e) {
        ToastAlert(e.message);
      }
    };
    getTrailDetail();
  }, [dispatch]);

  if (!(JSON.stringify(trailData) === "{}")) {
    spinner = false;
    content = (
      <>
        <View style={[styles.containermain]}>
          <Tile
            imageSrc={{ uri: trailData.img_url }}
            title={trailData.name}
            featured
            activeOpacity={1}
            height={230}
            titleStyle={styles.tilettlstyle}
          />
          <View style={styles.section2}>
            <Text style={[styles.section2element1]}>
              Difficulty : {trailData.difficulty}
            </Text>
            <Text style={styles.section2element1}>
              Length : {trailData.length_km}
            </Text>
            <Text style={styles.section2element1}>
              Est Time : {trailData.estimate_time_min}
            </Text>
            <View style={[styles.section2element1]}>
              <StarRating
                style={styles.section2element1}
                disabled={true}
                emptyStar={"ios-star-outline"}
                fullStar={"ios-star"}
                halfStar={"ios-star-half"}
                iconSet={"Ionicons"}
                maxStars={5}
                rating={trailData.avg_rating}
                fullStarColor={"gold"}
                starSize={20}
              />
            </View>
          </View>
          <View style={styles.section2}>
            <Text style={[styles.section2element2]}>
              Activity : {trailData.activity_type}
            </Text>
            <Text style={[styles.section2element3]}>
              Location : {trailData.location}
            </Text>
          </View>
          <View style={styles.section3}>
            <Text>Description : {trailData.description}</Text>
          </View>

          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: (trailData.bbox[1] + trailData.bbox[3]) / 2,
              longitude: (trailData.bbox[0] + trailData.bbox[2]) / 2,
              latitudeDelta: 0.0422,
              longitudeDelta: 0.0121,
            }}
            provider="google"
            mapType="terrain"
            loadingEnabled
          >
            <Polyline
              coordinates={trailData.path}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={3}
            />
          </MapView>
          <View style={[styles.btnsection]}>
            <View style={[styles.btnsubsection]}>
              <Button
                title="Create Event"
                onPress={() => {
                  navigation.navigate("CreateEvent", {
                    item: route
                  });
                }}
              />
            </View>
            <View style={[styles.btnsubsection]}>
              <Button
                title="Join Event"
                onPress={() => {
                  navigation.navigate("ListEvent");
                }}
              />
            </View>
          </View>
        </View>
      </>
    );
  } else if (trailStatus === CONSTANTS.LOADING) {
    spinner = true;
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false;
    ToastAlert(error);
    content = error;
  }
  return (
    <View style={{ felx: 1 }}>
      <ScrollView>
        <LoadSpinner visible={spinner} />
        {content}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    margin: 10,
    width: Dimensions.get("window").width - 20,
    height: 275,
  },
  imageStyle: {
    width: Dimensions.get("window").width,
    height: 175,
    marginBottom: 5,
  },
  tilettlstyle: {
    fontWeight: "600",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  section2: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  section2element1: {
    flex: 1,
    padding: 2,
    margin: 5,
    fontWeight: "bold",
    color: "#979aad",
  },
  section2element2: {
    flex: 1,
    padding: 2,
    margin: 5,
    fontWeight: "bold",
    color: "#979aad",
  },
  section2element3: {
    flex: 2,
    padding: 2,
    margin: 2,
    fontWeight: "bold",
    color: "#979aad",
  },
  ratinglbl: {
    backgroundColor: "#000",
    borderRadius: 5,
    // alignItems:"center"
  },
  section3: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
  },
  section3top: {
    flexDirection: "row",
  },
  containermain: {
    backgroundColor: "#ecf0f1",
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  btnsection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnsubsection: {
    flex: 1,
    margin: 5,
  },
});

export default ViewTrailScreen;
