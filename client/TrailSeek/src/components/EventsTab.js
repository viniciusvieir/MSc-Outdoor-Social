import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, List, ListItem, Body } from "native-base";
import { useNavigation } from "@react-navigation/native";
import ColorConstants from "../util/ColorConstants";

const EventsTab = ({ trailData }) => {
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
        {list.map((l, i) => (
          //ViewNavigation to be changes part of a different stack in navigation, maybe use navigation reset TBD
          <ListItem
            key={i}
            bottomDivider
            onPress={() => {
              navigation.navigate("EventFlow", { screen: "ViewEvent" });
            }}
            s
            style={{ backgroundColor: ColorConstants.LGreen }}
          >
            <Body>
              <Text style={styles.listText}>{l.name}</Text>
              <Text note style={styles.listText}>
                {l.subtitle}
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
