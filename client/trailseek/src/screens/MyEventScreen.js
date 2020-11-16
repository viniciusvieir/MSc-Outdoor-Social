import React, { useState } from "react";
import { StyleSheet } from "react-native";
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

import ColorConstants from "../util/ColorConstants";

const MyEventScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);

  // const getEvents = async () => {
  //   try {
  //     // const results = await dispatch(fetchEvents(trailData._id));
  //     const uResults = unwrapResult(results);
  //     setEvents(uResults.data);
  //   } catch (e) {
  //     console.log(e);
  //     ToastAlert(e.message);
  //   }
  // };

  // isFocused ? getEvents() : null;

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     getEvents();
  //   });
  //   getEvents();
  //   return unsubscribe;
  // }, [navigation]);

  return (
    <Container
      style={{ backgroundColor: ColorConstants.DWhite, flex: 1 }}
      // contentContainerStyle={{ flex: 1 }}
    >
      {/* <Header androidStatusBarColor="#ffffff00">
        <Body>
          <Text>My Events</Text>
        </Body>
      </Header> */}
      <Content></Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.DWhite,
  },
});

export default MyEventScreen;
