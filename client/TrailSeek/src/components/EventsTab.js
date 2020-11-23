import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Button, List, ListItem, Body } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import ColorConstants from "../util/ColorConstants";
import { fetchEvents } from "../app/eventSlice";
import ToastAlert from "../components/ToastAlert";
import moment from "moment";

const EventsTab = ({ trailData }) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const getEvents = async () => {
    try {
      const results = await dispatch(fetchEvents(trailData._id));
      const uResults = unwrapResult(results);
      setEvents(uResults.data);
    } catch (e) {
      console.log(e);
      ToastAlert(e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getEvents();
    });
    getEvents();
    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        backgroundColor: ColorConstants.DWhite,
        flex: 1,
      }}
    >
      <Button
        onPress={() => {
          navigation.navigate("CreateEvent", {
            trailID: trailData._id,
            trailName: trailData.name,
          });
        }}
        full
        style={{ margin: 5, backgroundColor: ColorConstants.Yellow }}
      >
        <Text>Create Event</Text>
      </Button>
      <List>
        <FlatList
          style={{ marginBottom: 60 }}
          data={events}
          keyExtractor={(item) => {
            return item._id;
          }}
          renderItem={({ item }) => {
            if (!moment(item.date).isBefore(moment(), "day")) {
              return (
                <ListItem
                  onPress={() => {
                    navigation.navigate("ViewEvent", {
                      trailData,
                      eventData: item,
                    });
                  }}
                  noIndent
                  style={{ backgroundColor: ColorConstants.DWhite }}
                >
                  <Body>
                    <Text style={styles.listText}>{item.title}</Text>
                    <Text note style={styles.listText}>
                      {item.description}
                    </Text>
                  </Body>
                </ListItem>
              );
            }
          }}
        />
      </List>
    </View>
  );
};

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.Black2,
  },
});

export default EventsTab;
