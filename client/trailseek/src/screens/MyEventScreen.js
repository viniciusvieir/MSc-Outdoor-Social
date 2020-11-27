import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
// import { Text, Button, ListItem } from 'react-native-elements';
import {
  List,
  Body,
  Text,
  ListItem,
  Container,
  Content,
  Header,
} from "native-base";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import ColorConstants from "../util/ColorConstants";
import { getUserCreatedEvents, getUserJoinedEvents } from "../app/userSlice";
{
  /* <List>
            <ListItem itemHeader first>
              <Text>COMEDY</Text>
            </ListItem>
            <ListItem >
              <Text>Hangover</Text>
            </ListItem>
            <ListItem last>
              <Text>Cop Out</Text>
            </ListItem>
            <ListItem itemHeader>
              <Text>ACTION</Text>
            </ListItem>
            <ListItem>
              <Text>Terminator Genesis</Text>
            </ListItem>
          </List> */
}

const MyEventScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [myEvents, setMyEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const getUserEvents = async () => {
    try {
      const response = await dispatch(getUserCreatedEvents());
      const response2 = await dispatch(getUserJoinedEvents());
      const uMyEvents = unwrapResult(response);
      setMyEvents(uMyEvents);

      const uJoinedEvents = unwrapResult(response2);
      setJoinedEvents(uJoinedEvents);
    } catch (e) {
      console.log(e.message);
    }
  };
  console.log("My");
  console.log(myEvents);
  console.log("Joined");
  console.log(joinedEvents);

  useEffect(() => {
    getUserEvents();
    const unsubscribe = navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [navigation]);

  return (
    <Container style={{ backgroundColor: ColorConstants.DWhite, flex: 1 }}>
      <View>
        <List>
          {/* title */}
          <FlatList
            data={myEvents}
            keyExtractor={(item) => {
              return item._id;
            }}
            ListHeaderComponent={
              <ListItem itemHeader first>
                <Text>Created Events</Text>
              </ListItem>
            }
            ListEmptyComponent={<Text>No Data</Text>}
            renderItem={({ item }) => {
              return (
                <ListItem
                // onPress={() => {
                //   navigation.navigate("ViewEvent", {
                //     // trailData: null,
                //     eventID: item._id,
                //   });
                // }}
                >
                  <Text>{item.title}</Text>
                </ListItem>
              );
            }}
          />
          <FlatList
            data={joinedEvents}
            keyExtractor={(item) => {
              return item._id;
            }}
            ListHeaderComponent={
              <ListItem itemHeader first>
                <Text>Joined Events</Text>
              </ListItem>
            }
            ListEmptyComponent={<Text>No Data</Text>}
            renderItem={({ item }) => {
              return (
                <ListItem>
                  <Text>{item.title}</Text>
                </ListItem>
              );
            }}
          />
        </List>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.DWhite,
  },
});

export default MyEventScreen;
