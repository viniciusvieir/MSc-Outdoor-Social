import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../app/userSlice";
import { CommonActions } from "@react-navigation/native";

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

  return (
    <>
      <View style={styles.databox}>
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
            title="Edit Profile"
            buttonStyle={styles.button}
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
          />
          <Button
            title="Logout"
            buttonStyle={styles.button}
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
          />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  databox: {
    backgroundColor: "#fff",
    width: "100%",
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
    width: "20%",
  },
  attribute2: {
    width: "80%",
  },
  button: {
    margin: 10,
  },
});

export default ViewProfileScreen;
