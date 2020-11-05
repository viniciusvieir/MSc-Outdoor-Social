import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Button } from "native-base";
import StarRating from "react-native-star-rating";

const DetaiTabs = ({ trailData }) => {
  return (
    <ScrollView>
      <View style={[styles.containermain]}>
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
});

export default DetaiTabs;
