import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
// import { Text, Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  // Content,
  Button,
  // Form,
  // Input,
  // Item,
  Text,
  // Toast,
} from "native-base";

import { signIn } from "../app/userSlice";
import ToastAlert from "../components/ToastAlert";
import ColorConstants from "../util/ColorConstants";
import { unwrapResult } from "@reduxjs/toolkit";

const SigninScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();

  const error = useSelector((state) => state.user.profile.error);
  const isAuth = useSelector((state) => state.user.isAuth);

  const inputsHandler = (e, field) => {
    setInputs((inputs) => ({ ...inputs, [field]: e }));
  };

  const login = async () => {
    try {
      const res = await dispatch(signIn({ inputs }));
      const user = unwrapResult(res);
      setAuth(isAuth);
      navigation.navigate("MainTab");
      //clearing inputs object after login
      setInputs({});
    } catch (e) {
      // Toast.show({
      //   text: error,
      //   buttonText: "Okay",
      //   type: "danger",
      //   duration: 3000,
      // });
      console.log(e.message);
      console.log(error);
      ToastAlert(error);
    }
  };

  const { register, control, handleSubmit, errors } = useForm();

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <Container>
      <ImageBackground
        source={require("../images/sigininbg.jpg")}
        style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
      >
        <View style={styles.container}>
          {error && <Text style={{ color: "red" }}>{auth}</Text>}
          <View style={styles.containerhead}>
            <Image
              source={require("../images/tslogov2.2.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.containerform}>
            {/* Email */}
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    onChange(value);
                    inputsHandler(value, "email");
                  }}
                  value={value}
                  placeholder={"Email"}
                />
              )}
              name="email"
              type="email"
              rules={{
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Not a valid email",
                },
              }}
              defaultValue=""
            />
            {errors.email && (
              <Text style={styles.errstl}>{errors?.email?.message}</Text>
            )}

            {/* Password */}
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  // onChangeText={value => onChange(value)}
                  onChangeText={(value) => {
                    onChange(value);
                    inputsHandler(value, "password");
                  }}
                  value={value}
                  placeholder={"Password"}
                  secureTextEntry={true}
                />
              )}
              name="password"
              type="password"
              rules={{
                required: { value: true, message: "Password is required" },
              }}
              defaultValue=""
            />
            {errors.password && (
              <Text style={styles.errstl}>{errors?.password?.message}</Text>
            )}

            <View style={styles.containerbuttons}>
              <Button
                onPress={() => {
                  handleSubmit(login());
                }}
                style={{
                  backgroundColor: ColorConstants.Yellow,
                  marginBottom: 10,
                }}
                block
              >
                <Text style={{ color: ColorConstants.Black }}>Login</Text>
              </Button>

              <Button
                onPress={() => navigation.navigate("Signup")}
                block
                style={{ backgroundColor: ColorConstants.DGreen }}
              >
                <Text style={styles.buttonText}>Sign up</Text>
              </Button>
            </View>
          </View>
          <View style={styles.containerfooter}>
            <Button
              onPress={() => navigation.navigate("MainTab")}
              style={{
                backgroundColor: ColorConstants.Yellow,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", color: ColorConstants.Black }}>
                Skip
              </Text>
            </Button>
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorConstants.LGreen + 90,
    // zIndex: 10,
  },
  containerhead: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  containerform: {
    flex: 2,
    alignItems: "center",
    // justifyContent: 'center',
    width: "100%",
    flexDirection: "column",
  },

  input: {
    width: "80%",
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    backgroundColor: ColorConstants.DWhite,
    borderRadius: 10,
  },

  containerbuttons: {
    width: "80%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  containerfooter: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  image: {
    width: "100%",
    height: 120,
    alignSelf: "center",
  },

  errstl: {
    color: "red",
    marginBottom: 10,
    width: "80%",
  },
  buttonText: {
    color: ColorConstants.DWhite,
  },
});

export default SigninScreen;
