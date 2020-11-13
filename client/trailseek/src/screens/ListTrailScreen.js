import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { unwrapResult } from "@reduxjs/toolkit";

import ToastAlert from "../components/ToastAlert";
import LoadSpinner from "../components/LoadSpinner";
import { fetchTrailsByQuery } from "../app/trailSlice";
import CONSTANTS from "../util/Constants";
import NoData from "../components/NoData";
import ColorConstants from "../util/ColorConstants";

const ListTrailScreen = ({ route }) => {
  const { query } = route.params;
  let content;
  const limit = 100000;
  let spinner = true;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [filteredTrails, setFilteredTrails] = useState([]);

  const trailStatus = useSelector((state) => state.trails.status);
  const error = useSelector((state) => state.trails.error);

  useEffect(() => {
    const getTrailsByQuery = async () => {
      try {
        const results = await dispatch(fetchTrailsByQuery({ query, limit }));
        const uResults = unwrapResult(results);
        setFilteredTrails(uResults.response);
      } catch (e) {
        ToastAlert(e.message);
        ToastAlert(error);
      }
    };
    getTrailsByQuery();
  }, []);

  useEffect(() => {
    dispatch(fetchTrailsByQuery({ query, limit }));
  }, []);

  if (trailStatus === CONSTANTS.LOADING) {
    spinner = true;
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false;
    ToastAlert(error);
    content = <Text>{error}</Text>;
  } else if (trailStatus === CONSTANTS.SUCCESS) {
    spinner = false;
    content =
      filteredTrails.length > 0 ? (
        filteredTrails.map((l, item) => (
          <ListItem
            key={item}
            bottomDivider
            onPress={() => {
              navigation.navigate("ViewTrail", { id: l._id, name: l.name });
            }}
          >
            <ListItem.Content>
              <ListItem.Title
                style={{ backgroundColor: ColorConstants.DWhite }}
              >
                {l.name}
              </ListItem.Title>
              <ListItem.Subtitle
                style={{ backgroundColor: ColorConstants.DWhite }}
              >
                {l.location}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      ) : (
        <NoData />
      );
  }
  return (
    <ScrollView style={{ backgroundColor: ColorConstants.LGreen }}>
      <LoadSpinner visible={spinner} />
      {content}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default ListTrailScreen;
