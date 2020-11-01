import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, SearchBar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllTrails } from "../app/trailSlice";
import LoadSpinner from "../components/LoadSpinner";
import ToastAlert from "../components/ToastAlert";
import TrailCard from "../components/TrailCards";
import CONSTANTS from "../util/Constants";

const SearchTrailScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const trailStatus = useSelector((state) => state.trails.status);
  const error = useSelector((state) => state.trails.error);
  const user = useSelector((state) => state.user.profile.name);

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
  };

  let searchParam = {
    titel: "Search Results",
    query: {
      $text: {
        $search: `${searchTerm}`,
      },
    },
  };

  if (trailStatus === CONSTANTS.LOADING) {
    spinner = true;
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false;
    ToastAlert(error);
    content = <Text>{error}</Text>;
  } else if (trailStatus === CONSTANTS.SUCCESS) {
    spinner = false;
  }

  return (
    <View style={styles.container}>
      <LoadSpinner visible={spinner} />
      <Text h3 style={{ marginLeft: 5 }}>
        Hi! {user ? user : "User"}
      </Text>
      <SearchBar
        style={styles.searchbar}
        lightTheme={true}
        placeholder="Search"
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
        }}
        autoCapitalize="none"
        platform="android"
        autoCompleteType="name"
        enablesReturnKeyAutomatically
        onSubmitEditing={() => {
          navigation.navigate("ListTrail", { query: searchParam.query });
        }}
      />
      <ScrollView>
        <TrailCard getParams={nearMe} location={true} />
        <TrailCard getParams={easyParams} />
        <TrailCard getParams={bestParams} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    width: "100%",
    alignItems: "center",
    marginTop: 25,
  },
  subcontainer: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    width: "90%",
  },
  texth3: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
  },
  searchbarcontainer: {
    width: "90%",
    alignSelf: "center",
  },
});

export default SearchTrailScreen;
