import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, List, ListItem, Body } from "native-base";
import { useNavigation } from "@react-navigation/native";
import trailSeek from "../api/trailSeek";

import ColorConstants from "../util/ColorConstants";

const EventsTab = ({ trailData }) => {
  // const [events] = useState([])
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const results = await trailSeek.get(`/trails/${trailData._id}/events`); // need to send :trailId
        console.log(results);
        setEvents(results.data);
      } catch (e) {
        console.log(e);
        ToastAlert(e.message);
      }
    };
    getEvents();
  }, []);

  // const list = [
  //   {
  //     name: "Event0",
  //     subtitle: "Location",
  //   },
  //   {
  //     name: "Event1",
  //     subtitle: "Location",
  //   },
  // ];

  const navigation = useNavigation();
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
            // screen: "CreateEvent",
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
        {events.map((l, i) => (
          //ViewNavigation to be changes part of a different stack in navigation, maybe use navigation reset TBD
          <ListItem
            key={i}
            onPress={() => {
              navigation.navigate("EventFlow", { screen: "ViewEvent" });
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
    </View>
  );
};

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.DWhite,
  },
});

export default EventsTab;
