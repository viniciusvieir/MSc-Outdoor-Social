import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Grid, Col, Row, View, Text, Button } from "native-base";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";

const CovidWidget = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const day = (dt) => {
    const day = moment(dt).format("ddd");
    return <Text>{day}</Text>;
  };

  const date = (dt) => {
    const date = moment(dt).format("DD/MM");
    return <Text>{date}</Text>;
  };
  const lastItem = data.length - 1;
  return (
    <View>
      <Button
        bordered
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text>
          Covid Cases in {data[lastItem].attributes.CountyName} as of{" "}
          {day(data[lastItem].attributes.TimeStamp)} (
          {date(data[lastItem].attributes.TimeStamp)}) :{" "}
          {data[lastItem].attributes.ConfirmedCovidCases} (+
          {data[lastItem].attributes.ConfirmedCovidCases -
            data[lastItem - 1].attributes.ConfirmedCovidCases}
          )
        </Text>
      </Button>

      <Modal
        visible={false}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={modalVisible}
      >
        <ScrollView horizontal>
          <LineChart
            data={{
              labels: data.map((item) => {
                return moment(item.attributes.TimeStamp).format("DD/MM");
              }),
              datasets: [
                {
                  data: data.map((item) => {
                    return item.attributes.ConfirmedCovidCases;
                  }),
                },
              ],
            }}
            width={500} // from react-native
            height={220}
            // yAxisLabel="$"
            // yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              //   backgroundGradientFrom: "#fb8c00",
              //   backgroundGradientTo: "#ffa726",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "1",
                strokeWidth: "1",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
        <Button
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Text>Close</Text>
        </Button>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CovidWidget;
