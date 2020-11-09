import React from "react";
import { StyleSheet, Image, FlatList } from "react-native";
import { Grid, Col, Row, Text } from "native-base";
import moment from "moment";

const WeatherWidget = ({ data }) => {
  const day = (dt) => {
    const day = moment(dt * 1000).format("ddd");
    return <Text style={styles.bold}>{day.toUpperCase()}</Text>;
  };

  const date = (dt) => {
    const date = moment(dt * 1000).format("DD/MM");
    return <Text>{date}</Text>;
  };

  //   console.log(data);

  return (
    <FlatList
      horizontal
      data={data.daily}
      keyExtractor={(itemW) => {
        itemW.dt;
      }}
      renderItem={({ item }) => {
        return (
          <Grid>
            <Row>{day(item.dt)}</Row>
            <Row>{date(item.dt)}</Row>
            <Row>
              <Image
                style={{ width: 80, height: 80 }}
                source={{
                  uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
              />
            </Row>
            <Row>
              <Text>
                {Math.ceil(item.temp.max)}° - {Math.floor(item.temp.min)}°
              </Text>
            </Row>
          </Grid>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default WeatherWidget;
