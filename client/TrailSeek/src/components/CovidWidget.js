import React from "react";
import { StyleSheet, Image, FlatList } from "react-native";
import { Grid, Col, Row, View, Text } from "native-base";
import moment from "moment";

const CovidWidget = ({ data }) => {
  console.log(data);
  const day = (dt) => {
    const day = moment(dt).format("ddd");
    return <Text style={styles.bold}>{day}</Text>;
  };

  const date = (dt) => {
    const date = moment(dt).format("DD/MM");
    return <Text>{date}</Text>;
  };

  return (
    <View>
      <Text>
        Covid Cases in {data[0].attributes.CountyName} as of{" "}
        {day(data[0].attributes.TimeStamp)} (
        {date(data[0].attributes.TimeStamp)}) :{" "}
        {data[0].attributes.ConfirmedCovidCases} (+
        {data[0].attributes.ConfirmedCovidCases -
          data[1].attributes.ConfirmedCovidCases}
        )
      </Text>
      {/* {data.map((item) => {
        return <Text>{item.attributes.ConfirmedCovidCases}</Text>;
      })} */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default CovidWidget;
