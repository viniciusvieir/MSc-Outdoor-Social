import React, { useState, useEffect } from "react";
import { StyleSheet, Modal, Dimensions } from "react-native";
import { View, Text, Button } from "native-base";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";
import ColorConstants from "../util/ColorConstants";

const CovidWidget = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const day = (dt) => {
    const day = moment(dt).format("ddd").toString();
    return day;
  };

  const date = (dt) => {
    const date = moment(dt).format("DD/MM").toString();
    return date;
  };
  let content;
  if (data.length > 0) {
    const lastItem = data.length - 1;
    const pastCumiCases = data[0].attributes.ConfirmedCovidCases;
    content = (
      <View style={{ flex: 1 }}>
        <Button
          button
          danger
          style={{
            padding: 0,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 13 }}>
            Covid Cases in the last 10 days in{" "}
            {data[lastItem].attributes.CountyName} as of{" "}
            {day(data[lastItem].attributes.TimeStamp)} (
            {date(data[lastItem].attributes.TimeStamp)}) :{" "}
            {data[lastItem].attributes.ConfirmedCovidCases - pastCumiCases} (+
            {data[lastItem].attributes.ConfirmedCovidCases -
              data[lastItem - 1].attributes.ConfirmedCovidCases}
            )
          </Text>
        </Button>

        <Modal
          visible={false}
          animationType="fade"
          presentationStyle="overFullScreen"
          transparent
          // style={{ borderBottomColor: "red", borderWidth: 5 }}
          visible={modalVisible}
        >
          <View
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              backgroundColor: ColorConstants.LGreen + "95",
            }}
          >
            <LineChart
              fromZero={true}
              data={{
                labels: data.slice(1).map((item) => {
                  return moment(item.attributes.TimeStamp)
                    .format("DD/MM")
                    .toString();
                }),
                datasets: [
                  {
                    data: data.slice(1).map((item) => {
                      return (
                        item.attributes.ConfirmedCovidCases - pastCumiCases
                      );
                    }),
                  },
                ],
              }}
              width={Dimensions.get("window").width - 10} // from react-native
              height={300}
              // yAxisLabel="$"
              // yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: ColorConstants.DGreen,
                //   backgroundGradientFrom: "#fb8c00",
                //   backgroundGradientTo: "#ffa726",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                // style: {
                //   // borderRadius: 10,
                //   // height: 200,
                // },
                propsForDots: {
                  r: "1",
                  strokeWidth: "1",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 10,
                borderRadius: 10,
              }}
            />
            <Button
              style={{
                backgroundColor: ColorConstants.Yellow,
                marginEnd: 10,
                alignSelf: "flex-end",
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text>Close</Text>
            </Button>
          </View>
        </Modal>
      </View>
    );
  } else {
    content = <Text>No Covid Data</Text>;
  }

  return <View>{content}</View>;
};

const styles = StyleSheet.create({});

export default CovidWidget;
