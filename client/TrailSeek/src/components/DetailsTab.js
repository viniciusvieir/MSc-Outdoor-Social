import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Button } from "native-base";
import StarRating from "react-native-star-rating";
import weather from "../api/weather";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const DetaiTabs = ({ trailData }) => {
  const navigation = useNavigation();
  const [weatherData, setWeatherData] = useState({});
  let weatherContent;
  const getWeaterData = async () => {
    try {
      const response = await weather.get("/onecall", {
        params: {
          // appid:trailData.weatherApiToken,
          lat: trailData.start.coordinates[0],
          lon: trailData.start.coordinates[1],
          exclude: "hourly,minutely,alerts",
        },
      });
      setWeatherData(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getWeaterData();
  }, []);

  // weatherContent =
  //   JSON.stringify(weatherData) != "{}" ? (
  //     weatherData.daily.map((item) => <Text>{new Date(item.dt)}</Text>)
  //   ) : (
  //     <Text>No Weather Data</Text>
  //   );
  // console.log(weatherData);
  return (
    <ScrollView nestedScrollEnabled>
      <View style={[styles.containermain]}>
        <View style={styles.section2}>
          <Text style={[styles.section2element1]}>
            Difficulty : {trailData.difficulty}-
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
        <View>{weatherContent}</View>
        <View style={styles.section3}>
          <Text>Description : {trailData.description}</Text>
        </View>
        <ScrollView
          horizontal
          style={{ maxHeight: 275 }}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          <FlatList
            nestedScrollEnabled
            horizontal
            data={trailData.recommended}
            keyExtractor={(trails) => {
              return trails._id;
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("ViewTrail", {
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
                        <Text style={styles.locationStyle}>
                          {item.location}
                        </Text>
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
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default DetaiTabs;
