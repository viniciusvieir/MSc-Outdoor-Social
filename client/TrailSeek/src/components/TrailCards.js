import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Button, Text, H1, Card, CardItem } from "native-base";

import ColorConstants from "../util/ColorConstants";
import NoData from "./NoData";

const TrailCards = ({ title, trails, fetchMoreData, filter }) => {
  const navigation = useNavigation();

  let content = trails ? (
    <View style={{ backgroundColor: ColorConstants.LGreen, flex: 1 }}>
      <H1
        style={{
          backgroundColor: ColorConstants.LGreen,
          color: ColorConstants.White,
          marginLeft: 10,
          marginVertical: 5,
          fontWeight: "bold",
        }}
      >
        {title}
      </H1>
      <FlatList
        ListEmptyComponent={<NoData />}
        // initialNumToRender={10}
        data={trails}
        keyExtractor={(trails) => {
          return trails._id;
        }}
        ListFooterComponent={
          trails.length >= 10 ? (
            <Button
              block
              onPress={() => {
                navigation.navigate("ListTrail", { filter });
              }}
              style={{
                margin: 5,
                backgroundColor: ColorConstants.Yellow,
              }}
            >
              <Text>View More</Text>
            </Button>
          ) : null
        }
        // onEndReached={fetchMoreData}
        // onEndReachedThreshold={0.3}
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
              <Card
                style={{
                  width: Dimensions.get("screen").width - 20,
                  alignSelf: "center",
                  backgroundColor: ColorConstants.DWhite,
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
                <CardItem>
                  <Grid>
                    <Row>
                      <Text style={styles.nameStyle}>{item.name}</Text>
                    </Row>
                    <Row>
                      <Col size={3}>
                        <Text>{item.location}</Text>
                      </Col>
                      <Col size={1}>
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
                      </Col>
                    </Row>
                  </Grid>
                </CardItem>
                <Button
                  block
                  style={{
                    margin: 5,
                    backgroundColor: ColorConstants.DGreen,
                  }}
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
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  ) : null;
  return content;
};

const styles = StyleSheet.create({
  imageStyle: {
    width: null,
    flex: 1,
    height: 190,
  },
  nameStyle: {
    fontWeight: "800",
    fontSize: 18,
    flexShrink: 1,
    color: "#404040",
  },
  viewMore: {
    padding: 15,
    justifyContent: "center",
    marginLeft: 5,
  },
});

export default TrailCards;
