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
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating";
import { AntDesign } from "@expo/vector-icons";

import ToastAlert from "./ToastAlert";
import { fetchTrailsByQuery } from "../app/trailSlice";
import { getLocation } from "../app/userSlice";

const TrailCards = ({ getParams, location }) => {
  const { query, title } = getParams;
  const [trails, setTrails] = useState([]);
  const error = useSelector((state) => state.trails.error);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
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
    getTrailsByQuery();
  }, []);

  let content = trails ? (
    <View style={styles.card}>
      <Text h4 style={styles.titleStyle}>
        {title}
      </Text>
      <ScrollView
        horizontal
        style={{ maxHeight: 275 }}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          horizontal
          data={trails}
          keyExtractor={(trails) => {
            return trails._id;
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ViewTrail", {
                    id: item._id,
                    name: item.name,
                  });
                }}
              >
                <View style={styles.listitem}>
                  <Image
                    source={{ uri: item.img_url }}
                    style={styles.imageStyle}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                  <View style={styles.caption}>
                    <Text style={styles.nameStyle}>{item.name}</Text>
                    <View style={styles.rateloc}>
                      <Text style={styles.locationStyle}>{item.location}</Text>
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
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        {trails.length >= 10 ? (
          <TouchableOpacity
            style={styles.viewMore}
            onPress={() => {
              navigation.navigate("ListTrail", { getParams });
            }}
          >
            <AntDesign
              name="right"
              size={24}
              color="black"
              style={{ alignSelf: "center" }}
            />
            <Text style={{ fontSize: 10 }}>View More</Text>
          </TouchableOpacity>
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
    flexShrink: 1,
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
    width: 250,
    height: 175,
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
    width: 160,
    color: "#666666",
  },
  titleStyle: {
    marginLeft: 10,
    color: "#395693",
  },
  caption: {
    width: 250,
    marginLeft: 5,
  },
  rateloc: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    height: 5,
    width: 10,
  },
  viewMore: {
    height: 200,
    justifyContent: "center",
    marginLeft: 5,
  },
});

export default TrailCards;
