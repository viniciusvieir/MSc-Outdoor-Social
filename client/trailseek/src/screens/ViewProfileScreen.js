import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../app/userSlice";

const ViewProfileScreen = ({ navigation }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
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
      {isAuth ? (
        <Button
          title="Edit Profile"
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        />
      ) : null}
      {isAuth ? (
        <Button
          title="Logout"
          onPress={() => {
            userLogout();
            navigation.navigate("Authentication", { screen: "Signin" });
          }}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({});

export default ViewProfileScreen;
