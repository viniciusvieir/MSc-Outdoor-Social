import React from "react";
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
import ColorConstants from "../util/ColorConstants";

const MyEventScreen = ({ navigation }) => {
  const list = [
    {
      name: "Event0",
      subtitle: "Location",
    },
    {
      name: "Event1",
      subtitle: "Location",
    },
  ];
  return (
    <Container
      style={{ backgroundColor: ColorConstants.LGreen, flex: 1 }}
      // contentContainerStyle={{ flex: 1 }}
    >
      {/* <Header androidStatusBarColor="#ffffff00">
        <Body>
          <Text>My Events</Text>
        </Body>
      </Header> */}
      <Content>
        <List>
          {/* <Text h3>MyEventScreen</Text> */}
          {list.map((l, i) => (
            <ListItem
              key={i}
              onPress={() => {
                navigation.navigate("ViewEvent");
              }}
              noIndent
            >
              <Body>
                <Text style={styles.listText}>{l.name}</Text>
                <Text style={styles.listText} note>
                  {l.subtitle}
                </Text>
              </Body>
            </ListItem>
          ))}
        </List>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  listText: {
    color: ColorConstants.DWhite,
  },
});

export default MyEventScreen;
