import React, { useEffect } from "react";
import { View, StyleSheet, Image, Platform } from "react-native";
// import { Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../app/userSlice";
import { CommonActions } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import ToastAlert from "../components/ToastAlert";
import { AntDesign } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Button, Text, H1 } from "native-base";


const ViewProfileScreen = ({ navigation }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  // useEffect(() => {
  //   const fireEvent = navigation.addListener("tabPress", (e) => {
  //     return isAuth ? null : navigation.navigate("Signin");
  //   });
  //   return fireEvent;
  // }, [navigation]);
  const dispatch = useDispatch();

  const userLogout = async () => {
    try {
      const response = await dispatch(logOut());
    } catch (e) {
      console.log(e.message);
    }
  };



  const checNet=()=>{
    
      // For Android devices
      if (Platform.OS === "android") {
        NetInfo.fetch().then(state => {
          if(!state.isConnected){
            ToastAlert("Please make sure your internet is connected.");
          }else{
            ToastAlert("Internet is connected.");
          }
        });
      } else {
        // // For iOS devices
        // NetInfo.isConnected.addEventListener(
        //   "connectionChange",
        //   this.handleFirstConnectivityChange
        // );
        console.log("in iphone")

      }

  }

  return (
    <>

      <View style={styles.databox}>
      <View style={styles.card}><H1 style={styles.titleStyle}>{"User Profile"}</H1></View>

        <View style={styles.row}>
          <Text style={styles.attribute1}>NAME</Text>
          <Text style={styles.attribute}>DANISH</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.attribute1}>EMAIL</Text>
          <Text style={styles.attribute}>syeddanishjamil45@gmail.com</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.attribute1}>GENDER</Text>
          <Text style={styles.attribute}>MALE</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.attribute1}>DOB</Text>
          <Text style={styles.attribute}>10-10-1990</Text>
        </View>
      </View>

      {isAuth ? (
        <View style={styles.bottonbox}>
          
          <Button
            block
            style={styles.button}
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
            >
            <Text style={{ fontSize: 16, color: "white" }}>Edit Profile</Text>
            </Button>
          <Button
            block
            style={styles.button}
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
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  titleStyle:{
    alignSelf: "center",
    margin: 10,
    padding: 10,

  },
  databox: {
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: "column",
  },
  row: {
    padding: 5,
    borderBottomColor: "#aaa",
    borderBottomWidth: 0.3,
    flexDirection: "row",
  },
  attribute1: {
    width: "30%",
  },
  attribute2: {
    width: "70%",
  },
  button: {
    margin: 10,
    width: "90%",
    alignSelf: "center",
    color:"#fff",
  },
});

export default ViewProfileScreen;
