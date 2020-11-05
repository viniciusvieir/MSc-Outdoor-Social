import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
    <Container>
      <Header transparent>
        <Body>
          <Title style={{ color: "black", fontWeight: "bold", fontSize: 40 }}>
            {" "}
            Hi! {user ? user : "User"}
          </Title>
        </Body>
        {/* <H1 style={{ fontWeight: "bold", fontSize: 40 }}>
         
        </H1> */}
      </Header>

      <LoadSpinner visible={spinner} />

      <SearchBar
        containerStyle={styles.searchbar}
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

      <ScrollView horizontal style={{ marginTop: 10, maxHeight: 50 }}>
        <Button
          rounded
          onPress={() => setParams(bestParams)}
          style={styles.filterButtons}
        >
          <Text>Best Rated</Text>
        </Button>
        <Button
          rounded
          style={styles.filterButtons}
          onPress={() => {
            setParams(easyParams);
          }}
        >
          <Text>Easy Trails</Text>
        </Button>
        <Button
          rounded
          style={styles.filterButtons}
          onPress={() => {
            setParams(nearMe);
          }}
        >
          <Text>Near You</Text>
        </Button>
      </ScrollView>
      <Content>
        <View style={styles.container}>
          <ScrollView>
            {/* <TrailCard getParams={nearMe} location={true} /> */}
            <TrailCard getParams={params} />
            {/* <TrailCard getParams={bestParams} /> */}
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    width: "100%",
    // alignItems: "center",
    // marginTop: 30,
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
  searchbar: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  filterButtons: {
    marginHorizontal: 5,
  },
});

export default SearchTrailScreen;
