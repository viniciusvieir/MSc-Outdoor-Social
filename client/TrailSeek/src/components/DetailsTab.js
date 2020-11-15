import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, CardItem, Card } from "native-base";
import StarRating from "react-native-star-rating";
import { Col, Row, Grid } from "react-native-easy-grid";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

import WeatherWidget from "./WeatherWidget";
import CovidWidget from "./CovidWidget";
import ColorConstants from "../util/ColorConstants";
import NoData from "./NoData";

const DetaiTabs = ({ trailData }) => {
  const navigation = useNavigation();
  return (
    <ScrollView
      style={{ backgroundColor: ColorConstants.LGreen, flex: 1 }}
      nestedScrollEnabled
    >
      <Grid style={{ backgroundColor: ColorConstants.LGreen, margin: 10 }}>
        <Row>
          <Col size={2}>
            <Text style={styles.textInfoLabel}>Difficulty</Text>
            <Text style={styles.textInfo}>{trailData.difficulty}</Text>
          </Col>
          <Col size={2}>
            <Text style={styles.textInfoLabel}>Length</Text>
            <Text style={styles.textInfo}>{trailData.length_km} km</Text>
          </Col>
          <Col size={3}>
            <Text style={styles.textInfoLabel}>Rating</Text>
            <StarRating
              disabled={true}
              emptyStar={"ios-star-outline"}
              fullStar={"ios-star"}
              halfStar={"ios-star-half"}
              iconSet={"Ionicons"}
              maxStars={5}
              rating={trailData.avg_rating}
              fullStarColor={"gold"}
              starSize={25}
            />
          </Col>
        </Row>
        <Row style={{ marginVertical: 10 }}>
          <Col size={1}>
            <Text style={styles.textInfoLabel}>Activity</Text>
            <Text style={styles.textInfo}>{trailData.activity_type}</Text>
          </Col>
          <Col size={1}>
            <Text style={styles.textInfoLabel}>Est Time</Text>
            <Text style={styles.textInfo}>
              {moment
                .utc()
                .startOf("day")
                .add({ minutes: trailData.estimate_time_min })
                .format("H:mm")}
            </Text>
          </Col>
          <Col size={3}>
            <Text style={styles.textInfoLabel}>Location</Text>
            <Text style={styles.textInfo}>{trailData.location}</Text>
          </Col>
        </Row>
        <View
          style={{
            marginBottom: 5,
            borderBottomColor: ColorConstants.White,
            borderBottomWidth: 1,
          }}
        />
        <Row>
          <Text style={styles.textInfoLabel}>Description</Text>
        </Row>
        <Row>
          <Text style={styles.textInfoDescription}>
            {trailData.description}
          </Text>
        </Row>
        <View
          style={{
            marginVertical: 10,
            borderBottomColor: ColorConstants.White,
            borderBottomWidth: 1,
          }}
        />
        <Row>
          <CovidWidget data={trailData.covidData} />
        </Row>
        <View
          style={{
            marginVertical: 10,
            borderBottomColor: ColorConstants.White,
            borderBottomWidth: 1,
          }}
        />
        <Row>
          <WeatherWidget data={trailData.weatherData} />
        </Row>
      </Grid>
      <View
        style={{
          margin: 10,
          borderBottomColor: ColorConstants.White,
          borderBottomWidth: 1,
        }}
      />
      <Text style={styles.similarTrails}>Similar Trails : </Text>
      <FlatList
        ListEmptyComponent={<NoData />}
        nestedScrollEnabled
        horizontal
        data={trailData.recommended}
        keyExtractor={(trails) => {
          return trails._id;
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ flex: 1 }}>
              <Card
                style={{
                  width: 250,
                  marginLeft: 10,
                  backgroundColor: ColorConstants.DWhite,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("ViewTrail", {
                      id: item._id,
                      name: item.name,
                    });
                  }}
                >
                  <CardItem cardBody>
                    <Image
                      source={{ uri: item.img_url }}
                      style={styles.imageStyle}
                      PlaceholderContent={<ActivityIndicator />}
                      resizeMethod="auto"
                      resizeMode="cover"
                    />
                  </CardItem>
                  <CardItem style={{ backgroundColor: ColorConstants.DWhite }}>
                    <Grid>
                      <Col size={4}>
                        <Text>{item.name}</Text>
                      </Col>
                      <Col size={2}>
                        <StarRating
                          disabled={true}
                          emptyStar={"ios-star-outline"}
                          fullStar={"ios-star"}
                          halfStar={"ios-star-half"}
                          iconSet={"Ionicons"}
                          maxStars={5}
                          rating={item.avg_rating}
                          fullStarColor={"gold"}
                          starSize={16}
                        />
                      </Col>
                    </Grid>
                  </CardItem>
                </TouchableOpacity>
              </Card>
            </View>
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

  imageStyle: {
    width: null,
    flex: 1,
    height: 150,
  },
  similarTrails: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: ColorConstants.DWhite,
  },
});

export default DetaiTabs;
