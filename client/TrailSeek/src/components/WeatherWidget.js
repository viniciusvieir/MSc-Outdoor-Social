import React from "react";
import { StyleSheet, Image, FlatList, View } from "react-native";
import { Grid, Col, Row, Text } from "native-base";
import moment from "moment";
import ColorConstants from "../util/ColorConstants";

const WeatherWidget = ({ data }) => {
  const day = (dt) => {
    const day = moment(dt * 1000)
      .format("ddd")
      .toString();
    return day;
  };

  const date = (dt) => {
    const date = moment(dt * 1000)
      .format("DD/MM")
      .toString();
    return date;
  };

  return (
    <FlatList
      horizontal
      data={data.daily}
      keyExtractor={(itemW) => {
        itemW.dt;
      }}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        return (
          <View
            style={{
              borderRadius: 10,
              backgroundColor: "#ffffff70",
              marginHorizontal: 5,
            }}
          >
            <Grid>
              <Row
                style={{
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "center",
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: ColorConstants.DWhite,
                  }}
                >
                  {day(item.dt)}
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: ColorConstants.DWhite }}>
                  {date(item.dt)}
                </Text>
              </Row>
              <Row>
                <Image
                  style={{ width: 80, height: 80 }}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                  }}
                />
              </Row>
              <Row
                style={{
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "center",
                  marginBottom: 5,
                }}
              >
                <Text style={{ color: ColorConstants.DWhite }}>
                  {Math.ceil(item.temp.max)}° - {Math.floor(item.temp.min)}°
                </Text>
              </Row>
            </Grid>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default WeatherWidget;
