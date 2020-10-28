import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../app/userSlice";

const ViewProfileScreen = ({ navigation }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();
  return (
    <>
      {/* <Text h3>ViewProfileScreen</Text> */}
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
            dispatch(logOut()), navigation.navigate("Signin");
          }}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({});

export default ViewProfileScreen;
