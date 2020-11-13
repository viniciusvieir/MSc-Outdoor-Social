import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Container,
  Content,
  Button,
  Text,
  Header,
  Title,
  Body,
} from "native-base";

import LoadSpinner from "../components/LoadSpinner";
import ToastAlert from "../components/ToastAlert";
import TrailCard from "../components/TrailCards";
import CONSTANTS from "../util/Constants";
import ColorConstants from "../util/ColorConstants";
import { fetchTrailsByQuery } from "../app/trailSlice";
import { getLocation, fetchUserData } from "../app/userSlice";

const SearchTrailScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const trailStatus = useSelector((state) => state.trails.status);
  const error = useSelector((state) => state.trails.error);
  const user = useSelector((state) => state.user.profile.name);
  const isAuth = useSelector((state) => state.user.isAuth);
  const locationStatus = useSelector((state) => state.user.userLocation.status);
  // const filteredTrails = useSelector(
  //   (state) => state.trails.filteredTrails.data
  // );
  const [trails, setTrails] = useState([]);

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
  const [filter, setFilter] = useState(easyParams);

  let content,
    spinner = true;

  const getTrailsByQuery = async ({ location = false, query, skip = 0 }) => {
    try {
      let gpsLoc;
      if (location) {
        try {
          gpsLoc = await dispatch(getLocation());
        } catch (e) {
          ToastAlert(e.message);
        }
      }
      const results = await dispatch(
        fetchTrailsByQuery({ query, location, skip })
      );
      const uResult = unwrapResult(results);
      setTrails(uResult.response);
    } catch (e) {
      ToastAlert(e.message);
      ToastAlert(error);
    }
  };
  const getUserData = async () => {
    try {
      const response = await dispatch(fetchUserData());
    } catch (e) {
      ToastAlert(e.message);
    }
  };

  //Initial Trail Fetch
  useEffect(() => {
    getTrailsByQuery({
      query: filter?.query,
      location: filter?.location,
    });
    if (isAuth) {
      getUserData();
    }
    setSearchTerm("");
  }, []);

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
    <Container
      style={{ backgroundColor: ColorConstants.LGreen, flex: 1 }}
      contentContainerStyle={{ flex: 1 }}
    >
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
          onPress={() => {
            setFilter(bestParams);
            getTrailsByQuery({
              query: filter?.query,
              location: filter?.location,
            });
          }}
          style={styles.filterButtons}
        >
          <Text style={styles.filterButtonsText}>Best Rated</Text>
        </Button>
        <Button
          rounded
          style={styles.filterButtons}
          onPress={() => {
            setFilter(easyParams);
            getTrailsByQuery({
              query: filter?.query,
              location: filter?.location,
            });
          }}
        >
          <Text style={styles.filterButtonsText}>Easy Trails</Text>
        </Button>
        <Button
          rounded
          style={styles.filterButtons}
          onPress={() => {
            setFilter(nearMe);
            getTrailsByQuery({
              query: filter?.query,
              location: filter?.location,
            });
          }}
        >
          <Text style={styles.filterButtonsText}>Near You</Text>
        </Button>
      </ScrollView>
      <Content
        style={{ backgroundColor: ColorConstants.LGreen, flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
      >
        <TrailCard
          title={filter.title}
          trails={trails}
          filter={filter}
          // fetchMoreData={() =>
          //   getTrailsByQuery({
          //     query: filter?.query,
          //     location: filter?.location,
          //     skip: trails.length,
          //   })
          // }
        />
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
