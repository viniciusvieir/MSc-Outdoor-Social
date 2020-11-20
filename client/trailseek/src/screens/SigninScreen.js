import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Row } from "react-native-easy-grid";
import { Container, Button, Text, Content } from "native-base";

import { fetchUserData, signIn } from "../app/userSlice";
import ToastAlert from "../components/ToastAlert";
import ColorConstants from "../util/ColorConstants";
import { unwrapResult } from "@reduxjs/toolkit";

const SigninScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.profile.error);
  const isAuth = useSelector((state) => state.user.isAuth);

  return (
    <Container>
      <ImageBackground
        source={require("../images/sigininbg.jpg")}
        style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
      >
        <Content
          style={{
            paddingTop: 100,
            backgroundColor: ColorConstants.LGreen + 80,
            flex: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <Image
              source={require("../images/tslogov2.2.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={{ flex: 1, padding: 40 }}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string().label("Email").email().required(),
                password: Yup.string().label("Password").required(),
              })}
              onSubmit={async (values, formikActions) => {
                try {
                  const res = await dispatch(signIn({ inputs: values }));
                  const user = unwrapResult(res);
                  // console.log(user.token);
                  if (user.token) {
                    const results = await dispatch(fetchUserData());
                    const reS = unwrapResult(results);
                    navigation.navigate("MainTab");
                  }
                } catch (e) {
                  ToastAlert(error);
                }
              }}
            >
              {(props) => (
                <Grid>
                  <Row>
                    <Text style={{ color: ColorConstants.Black }}>Email :</Text>
                  </Row>
                  <Row>
                    <TextInput
                      autoFocus
                      autoCapitalize="none"
                      onChangeText={props.handleChange("email")}
                      onBlur={props.handleBlur("email")}
                      value={props.values.email}
                      autoCapitalize="none"
                      style={styles.input}
                      placeholderTextColor={ColorConstants.Black}
                    />
                  </Row>
                  <Row>
                    {props.touched.email && props.errors.email ? (
                      <Text style={styles.error}>{props.errors.email}</Text>
                    ) : null}
                  </Row>

                  <Row>
                    <Text style={{ color: ColorConstants.Black }}>
                      Password :
                    </Text>
                  </Row>
                  <Row>
                    <TextInput
                      onChangeText={props.handleChange("password")}
                      onBlur={props.handleBlur("password")}
                      value={props.values.password}
                      autoCapitalize="none"
                      style={styles.input}
                      keyboardType="default"
                      secureTextEntry={true}
                      placeholderTextColor={ColorConstants.Black}
                    />
                  </Row>
                  <Row>
                    {props.touched.password && props.errors.password ? (
                      <Text style={styles.error}>{props.errors.password}</Text>
                    ) : null}
                  </Row>

                  <Button
                    onPress={props.handleSubmit}
                    disabled={props.isSubmitting}
                    block
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                      backgroundColor: ColorConstants.Yellow,
                    }}
                  >
                    <Text>Login</Text>
                  </Button>
                  <Button
                    block
                    onPress={() => navigation.navigate("Signup")}
                    style={{
                      backgroundColor: ColorConstants.DGreen,
                      marginBottom: 16,
                    }}
                  >
                    <Text>Sign up</Text>
                  </Button>
                </Grid>
              )}
            </Formik>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            <Button
              onPress={() => navigation.navigate("MainTab")}
              style={{
                backgroundColor: ColorConstants.Yellow,
                marginBottom: 10,
                marginRight: 40,
              }}
            >
              <Text style={{ fontWeight: "bold", color: ColorConstants.Black }}>
                Skip
              </Text>
            </Button>
          </View>
        </Content>
      </ImageBackground>
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 120,
    alignSelf: "center",
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
});

export default SigninScreen;
