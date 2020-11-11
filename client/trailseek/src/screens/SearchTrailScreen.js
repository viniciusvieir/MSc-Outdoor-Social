import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Content,
  Button,
  Text,
  Spinner,
  H1,
  Header,
  Title,
  Body,
} from "native-base";

import { fetchAllTrails } from "../app/trailSlice";
import LoadSpinner from "../components/LoadSpinner";
import ToastAlert from "../components/ToastAlert";
import TrailCard from "../components/TrailCards";
import CONSTANTS from "../util/Constants";
import ColorConstants from "../util/ColorConstants";

const SearchTrailScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const trailStatus = useSelector((state) => state.trails.status);
  const error = useSelector((state) => state.trails.error);
  const user = useSelector((state) => state.user.profile.name);
  const locationStatus = useSelector((state) => state.user.userLocation.status);
  const [params, setParams] = useState({});

  let content,
    spinner = true;

  //Initial Trail Fetch
  useEffect(() => {
    const getAllTrails = async () => {
      try {
        const results = await dispatch(fetchAllTrails());
      } catch (e) {
        console.log(e);
        ToastAlert(e.message);
      }
    };
    if (trailStatus === CONSTANTS.IDLE) {
      getAllTrails();
    }
    setParams(easyParams);
  }, []);

  const easyParams = {
    title: "Easy Trails",
    query: {
      difficulty: "Easy",
      length_km: { $lt: 5 },
    },
  };

  const bestParams = {
    title: "Best Rated",
    query: {
      avg_rating: { $gt: 4 },
    },
  };

  const nearMe = {
    title: "Near You",
    location: true,
  };

  let searchParam = {
    titel: "Search Results",
    query: {
      $text: {
        $search: `${searchTerm}`,
      },
    },
  };

  if (
    trailStatus === CONSTANTS.LOADING ||
    locationStatus === CONSTANTS.LOADING
  ) {
    spinner = true;
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false;
    ToastAlert(error);
    content = <Text>{error}</Text>;
  } else if (
    trailStatus === CONSTANTS.SUCCESS ||
    locationStatus === CONSTANTS.LOADING
  ) {
    spinner = false;
  }

  return (
    <Container style={{ backgroundColor: ColorConstants.LGreen }}>
      <Header transparent androidStatusBarColor="#ffffff00">
        <Body>
          <Title
            style={{
              color: ColorConstants.White,
              fontWeight: "bold",
              fontSize: 40,
            }}
          >
            {" "}
            Hi! {user ? user : "User"}
          </Title>
        </Body>
      </Header>
      <LoadSpinner visible={spinner} />
      <SearchBar
        containerStyle={styles.searchbar}
        placeholder="Search"
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
        }}
        inputContainerStyle={{ height: 35, marginLeft: 3 }}
        autoCapitalize="none"
        platform="android"
        autoCompleteType="name"
        enablesReturnKeyAutomatically
        onSubmitEditing={() => {
          navigation.navigate("ListTrail", { query: searchParam.query });
        }}
      />
      <ScrollView
        horizontal
        style={{ marginTop: 10, maxHeight: 50, marginLeft: 10 }}
      >
        <Button
          rounded
          onPress={() => setParams(bestParams)}
          style={styles.filterButtons}
        >
          <Text style={styles.filterButtonsText}>Best Rated</Text>
        </Button>
        <Button
          rounded
          style={styles.filterButtons}
          onPress={() => {
            setParams(easyParams);
          }}
        >
          <Text style={styles.filterButtonsText}>Easy Trails</Text>
        </Button>
        <Button
          rounded
          style={styles.filterButtons}
          onPress={() => {
            setParams(nearMe);
          }}
        >
          <Text style={styles.filterButtonsText}>Near You</Text>
        </Button>
      </ScrollView>
      <Content>
        <TrailCard getParams={params} />
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    borderRadius: 20,
    marginHorizontal: 10,
    height: 50,
  },
  filterButtons: {
    marginHorizontal: 3,
    backgroundColor: ColorConstants.Yellow,
  },
  filterButtonsText: {
    color: ColorConstants.Black2,
  },
});

export default SearchTrailScreen;
