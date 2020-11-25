import React, { useState, useEffect } from "react";
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
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {});

    return unsubscribe;
  }, [navigation]);

  return (
    <Container style={{ backgroundColor: ColorConstants.DWhite, flex: 1 }}>
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
