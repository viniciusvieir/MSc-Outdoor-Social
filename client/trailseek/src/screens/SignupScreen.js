import React from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Container, Content, Toast } from "native-base";

import ToastAlert from "../components/ToastAlert";
import { signUp } from "../app/userSlice";
import ColorConstants from "../util/ColorConstants";
import UserForm from "../components/UserForm";

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.profile.error);
  const onSubmitFunc = async (values) => {
    try {
      const res = await dispatch(signUp({ inputs: values }));
      const user = unwrapResult(res);
      Toast.show({
        type: "success",
        text: "Account Created",
        buttonText: "Ok",
      });
      navigation.navigate("Signin");
    } catch (e) {
      ToastAlert(error);
    }
  };

  return (
    <Container>
      <ImageBackground
        source={require("../images/sigininbg.jpg")}
        style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
      >
        <Content style={{ backgroundColor: ColorConstants.LGreen + 80 }}>
          <View
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 60,
            }}
          >
            <View>
              <Image
                source={require("../images/tslogov2.2grey.png")}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
            <View style={{ flex: 1, padding: 30 }}>
              <UserForm onSubmitFunc={onSubmitFunc} />
            </View>
          </View>
        </Content>
      </ImageBackground>
    </Container>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 100,
    alignSelf: "center",
  },

  button: {
    marginBottom: 10,
    backgroundColor: ColorConstants.Yellow,
  },
  input: {
    borderColor: ColorConstants.darkGray + 60,
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: ColorConstants.DWhite,
  },
  error: {
    color: "red",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});
