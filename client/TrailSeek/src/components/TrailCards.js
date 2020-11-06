import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
// import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating";
import { AntDesign } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Button, Text, H1 } from "native-base";

import ToastAlert from "./ToastAlert";
import { fetchTrailsByQuery } from "../app/trailSlice";
import { getLocation } from "../app/userSlice";

const TrailCards = ({ getParams }) => {
  const { query, title } = getParams;
  const [trails, setTrails] = useState([]);
  const error = useSelector((state) => state.trails.error);
  const location = getParams.location ? getParams.location : false;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getTrailsByQuery = async () => {
    try {
      let gpsLoc;
      if (location) {
        try {
          gpsLoc = await dispatch(getLocation());
        } catch (e) {
          ToastAlert(e.message);
        }
      }
      const results = await dispatch(fetchTrailsByQuery({ query, location }));
      const uResults = unwrapResult(results);
      setTrails(uResults);
    } catch (e) {
      ToastAlert(e.message);
      ToastAlert(error);
    }
  };

  useEffect(() => {
    getTrailsByQuery();
  }, [getParams]);

  let content = trails ? (
    <View style={styles.card}>
      <H1 style={styles.titleStyle}>{title}</H1>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <FlatList
          data={trails}
          keyExtractor={(trails) => {
            return trails._id;
          }}
          // onEndReached={() => {
          //   getTrailsByQuery();
          // }}
          // onEndReachedThreshold={8}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ViewTrail", {
                    id: item._id,
                    name: item.name,
                    showEvents: false,
                  });
                }}
              >
                <Grid>
                  {/* <View style={styles.listitem}> */}
                  <Col>
                    <Image
                      source={{ uri: item.img_url }}
                      style={styles.imageStyle}
                      PlaceholderContent={<ActivityIndicator />}
                      resizeMethod="auto"
                      resizeMode="cover"
                    />
                  </Col>
                  <Col>
                    <View style={styles.caption}>
                      <Text style={styles.nameStyle}>{item.name}</Text>
                      <View style={styles.rateloc}>
                        <Text style={styles.locationStyle}>
                          {item.location}
                        </Text>
                        <View style={{ width: 150 }}>
                          <StarRating
                            disabled={true}
                            emptyStar={"ios-star-outline"}
                            fullStar={"ios-star"}
                            halfStar={"ios-star-half"}
                            iconSet={"Ionicons"}
                            maxStars={5}
                            rating={item.avg_rating}
                            fullStarColor={"gold"}
                            starSize={20}
                            starStyle={styles.rating}
                          />
                        </View>
                      </View>
                    </View>
                  </Col>
                  {/* </View> */}
                </Grid>
                <Button
                  block
                  style={{ margin: 5 }}
                  onPress={() => {
                    navigation.navigate("ViewTrail", {
                      id: item._id,
                      name: item.name,
                      showEvents: true,
                    });
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    View Events
                  </Text>
                </Button>
              </TouchableOpacity>
            );
          }}
        />
        {trails.length >= 10 ? (
          <Button
            bordered
            block
            onPress={() => {
              navigation.navigate("ListTrail", { getParams });
            }}
            style={{ marginHorizontal: 5 }}
          >
            <Text>View More</Text>
          </Button>
        ) : null}
      </ScrollView>
    </View>
  ) : (
    <ActivityIndicator animating={true} />
  );

  return content;
};

const styles = StyleSheet.create({
  listitem: {
    // flexShrink: 1,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    marginTop: 8,
    borderRadius: 8,
  },
  imageStyle: {
    borderRadius: 3,
    width: 200,
    height: 150,
    marginBottom: 5,
    marginLeft: 10,
  },
  nameStyle: {
    fontWeight: "800",
    fontSize: 18,
    flexShrink: 1,
    marginLeft: 5,
    color: "#404040",
  },
  locationStyle: {
    marginLeft: 5,
    // width: 160,
    color: "#666666",
  },
  titleStyle: {
    marginLeft: 10,
    color: "#395693",
  },
  caption: {
    // width: 250,
    marginLeft: 5,
  },
  rateloc: {
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  rating: {
    height: 30,
    width: 30,
    alignContent: "flex-start",
  },
  viewMore: {
    padding: 15,
    justifyContent: "center",
    marginLeft: 5,
  },
});

export default TrailCards;
