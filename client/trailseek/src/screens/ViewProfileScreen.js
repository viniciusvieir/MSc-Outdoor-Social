import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../app/userSlice";

const ViewProfileScreen = ({ navigation }) => {
  const isAuth = useSelector((state) => state.user.isAuth);

  if(isAuth !== true){
    navigation.navigate("Signin")
  }
  
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



    
        <Button
          title="Edit Profile"
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        />
        <Button
          title="Logout"
          onPress={() => {
            userLogout();
            navigation.navigate("Authentication", { screen: "Signin" });
          }}
        />
    </>
  );
};

const styles = StyleSheet.create({});

export default ViewProfileScreen;
