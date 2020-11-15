import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Button, List, ListItem, Body } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
// import trailSeek from "../api/trailSeek";

import ColorConstants from "../util/ColorConstants";
import { fetchEvents } from "../app/eventSlice";
import ToastAlert from "../components/ToastAlert";

const EventsTab = ({ trailData }) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  // const [isFocused,setIsFocused] = useState(fasle)
  const navigation = useNavigation();
  // const isFocused = navigation.isFocused();
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

  // isFocused ? getEvents() : null;

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
        backgroundColor: ColorConstants.LGreen,
        flex: 1,
      }}
    >
      <Button
        onPress={() => {
          navigation.navigate("CreateEvent", {
            trailID: trailData._id,
            trailName: trailData.name,
            // refreshEvents: getEvents,
          });
        }}
        full
        style={{ margin: 5, backgroundColor: ColorConstants.Yellow }}
      >
        <Text>Create Event</Text>
      </Button>
      <ScrollView>
        <List>
          {events.map((l, i) => (
            //ViewNavigation to be changes part of a different stack in navigation, maybe use navigation reset TBD
            <ListItem
              key={i}
              onPress={() => {
                navigation.navigate("ViewEvent", {
                  // screen: "ViewEvent",
                  // initial: false,
                  trailData,
                  eventData: l,
                });
              }}
              noIndent
              style={{ backgroundColor: ColorConstants.LGreen }}
            >
              <Body>
                <Text style={styles.listText}>{l.title}</Text>
                <Text note style={styles.listText}>
                  {l.description}
                </Text>
              </Body>
            </ListItem>
          ))}
        </List>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.DWhite,
  },
});

export default EventsTab;
