import React from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Container, Content, Toast } from "native-base";

import UserForm from "../components/UserForm";
import ColorConstants from "../util/ColorConstants";

const EditProfileScreen = () => {
  const { name, dob, gender, email } = useSelector(
    (state) => state.user.profile
  );
  const onSubmitFunc = async () => {};
  return (
    <Container style={{ backgroundColor: ColorConstants.DWhite }}>
      <Content>
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            backgroundColor: ColorConstants.DWhite,
            elevation: 24,
            margin: 50,
            padding: 20,
          }}
        >
          <UserForm
            userData={{
              name,
              dob,
              gender,
              email,
              password: "",
              confirmPassword: "",
            }}
            onSubmitFunc={onSubmitFunc}
          />
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default EditProfileScreen;
