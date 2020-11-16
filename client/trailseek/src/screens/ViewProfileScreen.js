import React, { useState } from "react";
import { StyleSheet, Platform, Switch } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { AntDesign } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Button, Text, H1, Container, Content, Thumbnail } from "native-base";
// import { unwrapResult } from "@reduxjs/toolkit";

import { logOut, toggleCovid } from "../app/userSlice";
// import { fetchUserData } from "../app/userSlice";
import ToastAlert from "../components/ToastAlert";
import ColorConstants from "../util/ColorConstants";

const ViewProfileScreen = ({ navigation }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const userData = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const covidToggle = useSelector((state) => state.user.covidToggle);
  // const [tCov, setTCov] = useState(null);
  // setTCov(covidToggle);
  // const [userData, setUserData] = useState({});

  // useEffect(() => {
  //   setUserData(userDataState)
  // }, []);

  const userLogout = async () => {
    try {
      const response = await dispatch(logOut());
    } catch (e) {
      console.log(e.message);
    }
  };

  const checNet = () => {
    // For Android devices
    if (Platform.OS === "android") {
      NetInfo.fetch().then((state) => {
        if (!state.isConnected) {
          ToastAlert("Please make sure your internet is connected.");
        } else {
          ToastAlert("Internet is connected.");
        }
      });
    } else {
      // // For iOS devices
      // NetInfo.isConnected.addEventListener(
      //   "connectionChange",
      //   this.handleFirstConnectivityChange
      // );
      console.log("in iphone");
    }
  };

  return (
    <Container style={{ backgroundColor: ColorConstants.LGreen }}>
      <Content
        style={{
          backgroundColor: "#ffffff20",
          margin: 30,
          borderRadius: 100,
          padding: 50,
        }}
      >
        <Grid style={{ alignItems: "center" }}>
          <Row
            size={25}
            style={{
              height: 150,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Thumbnail
              style={{ borderColor: ColorConstants.DGreen, borderWidth: 3 }}
              large
              source={{
                uri: `https://eu.ui-avatars.com/api/?name=${userData.name}`,
              }}
            />
          </Row>
          <Row size={20} style={{ alignItems: "center" }}>
            {/* <View style={styles.databox}> */}
            <Text
              style={{
                color: ColorConstants.DWhite,
                fontSize: 40,
                fontWeight: "bold",
                alignSelf: "center",
                // marginHorizontal: 20,
              }}
            >
              {userData.name}
            </Text>
          </Row>
          <Row size={10}>
            <Text style={styles.attribute1}>Email</Text>
            <Text style={styles.attribute}>{userData.email}</Text>
          </Row>
          <Row size={10}>
            <Text style={styles.attribute1}>Gender</Text>
            <Text style={styles.attribute}>{userData.gender}</Text>
          </Row>
          <Row size={10}>
            <Text style={styles.attribute1}>DoB</Text>
            <Text style={styles.attribute}>{userData.dob}</Text>
          </Row>
          <Row size={10}>
            <Text style={styles.attribute1}>Toggle Covid Information</Text>
            <Switch
              value={covidToggle}
              onValueChange={() => dispatch(toggleCovid())}
            />
          </Row>
          {/* </View> */}

          {isAuth ? (
            <>
              {/*             
              <Row size={10}>
                <Button
                  block
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate("EditProfile");
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    Edit Profile
                  </Text>
                </Button>
              </Row> */}
              <Row size={10}>
                <Button
                  danger
                  block
                  style={{ marginTop: 30 }}
                  onPress={async () => {
                    const res = await userLogout();
                    console.log(res);
                    await navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Authentication" }],
                      })
                    );
                    // navigation.navigate("Authentication");
                  }}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>Logout</Text>
                </Button>
              </Row>
            </>
          ) : null}
        </Grid>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  attribute1: {
    color: ColorConstants.DWhite,
    width: "30%",
  },
  attribute: {
    color: ColorConstants.DWhite,
    width: "70%",
  },
});

export default ViewProfileScreen;
