import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Text, Container, Button, Content } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";

import ToastAlert from "../components/ToastAlert";
import { signUp } from "../app/userSlice";

import moment from "moment";
import ColorConstants from "../util/ColorConstants";

const SignupScreen = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.profile.error);

  // const onSignup = async () => {
  //   try {
  //     const res = await dispatch(signUp({ inputs }));
  //     const user = unwrapResult(res);
  //     setAuth(isAuth);
  //     navigation.navigate("Signin");
  //   } catch (e) {
  //     ToastAlert(error);
  //   }
  // };
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
              <Formik
                initialValues={{
                  name: "",
                  gender: "M",
                  dob: moment().format("YYYY-MM-DD"),
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required("Required"),
                  gender: Yup.string().required("Required"),
                  dob: Yup.date().required("Required"),
                  email: Yup.string().label("Email").email().required(),
                  password: Yup.string()
                    .label("Password")
                    .required()
                    .min(2, "Seems a bit short...")
                    .max(
                      10,
                      "We prefer insecure system, try a shorter password."
                    ),
                  confirmPassword: Yup.string()
                    .required()
                    .label("Confirm password")
                    .test(
                      "passwords-match",
                      "Passwords must match ya fool",
                      function (value) {
                        return this.parent.password === value;
                      }
                    ),
                })}
                onSubmit={async (values, formikActions) => {
                  try {
                    const res = await dispatch(signUp({ inputs: values }));
                    const user = unwrapResult(res);
                    navigation.navigate("Signin");
                    formikActions.setSubmitting(false);
                  } catch (e) {
                    ToastAlert(error);
                  }
                }}
              >
                {(props) => (
                  <Grid>
                    <Row>
                      <Text>Name :</Text>
                    </Row>
                    <Row>
                      <TextInput
                        onChangeText={props.handleChange("name")}
                        onBlur={props.handleBlur("name")}
                        value={props.values.title}
                        autoFocus
                        style={styles.input}
                        autoCapitalize="words"
                        placeholderTextColor={ColorConstants.Black}
                      />
                    </Row>
                    <Row>
                      {props.touched.name && props.errors.name ? (
                        <Text style={styles.error}>{props.errors.name}</Text>
                      ) : null}
                    </Row>
                    <Row>
                      <Text style={{ color: ColorConstants.Black }}>
                        Date of Birth :{" "}
                      </Text>
                    </Row>
                    <Row>
                      <TouchableOpacity
                        onPress={() => {
                          setShow(true);
                        }}
                        style={[styles.input, { flexDirection: "row" }]}
                      >
                        <Col style={{ justifyContent: "center" }}>
                          <Text>
                            {moment(props.values.dob).format("YYYY-MM-DD")}
                          </Text>
                        </Col>
                        <Col
                          style={{
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <FontAwesome5
                            name="calendar-alt"
                            size={24}
                            color={ColorConstants.darkGray}
                          />
                        </Col>
                      </TouchableOpacity>
                    </Row>
                    <Row>
                      {props.touched.dob && props.errors.dob ? (
                        <Text style={styles.error}>{props.errors.dob}</Text>
                      ) : null}
                    </Row>
                    {show && (
                      <DateTimePicker
                        display="default"
                        mode="date"
                        onChange={(event, selectedDate) => {
                          setShow(Platform.OS === "ios");
                          props.setFieldValue(
                            "dob",
                            moment(selectedDate).format("YYYY-MM-DD")
                          );
                        }}
                        value={moment(props.values.dob).toDate()}
                      />
                    )}
                    <Row>
                      <Text style={{ color: ColorConstants.Black }}>
                        Gender :
                      </Text>
                    </Row>
                    <Row>
                      <Picker
                        selectedValue={props.values.gender}
                        style={styles.input}
                        onValueChange={(itemValue, itemIndex) =>
                          props.setFieldValue("gender", itemValue)
                        }
                      >
                        <Picker.Item label="Male" value="M" />
                        <Picker.Item label="Female" value="F" />
                      </Picker>
                    </Row>
                    <Row>
                      {props.touched.gender && props.errors.gender ? (
                        <Text style={styles.error}>{props.errors.gender}</Text>
                      ) : null}
                    </Row>
                    <Row>
                      <Text style={{ color: ColorConstants.Black }}>
                        Email :
                      </Text>
                    </Row>
                    <Row>
                      <TextInput
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
                        <Text style={styles.error}>
                          {props.errors.password}
                        </Text>
                      ) : null}
                    </Row>
                    <Row>
                      <Text style={{ color: ColorConstants.Black }}>
                        Confirm Password :
                      </Text>
                    </Row>
                    <Row>
                      <TextInput
                        onChangeText={props.handleChange("confirmPassword")}
                        onBlur={props.handleBlur("confirmPassword")}
                        value={props.values.confirmPassword}
                        autoCapitalize="none"
                        style={styles.input}
                        keyboardType="default"
                        secureTextEntry={true}
                        placeholderTextColor={ColorConstants.Black}
                      />
                    </Row>
                    <Row>
                      {props.touched.confirmPassword &&
                      props.errors.confirmPassword ? (
                        <Text style={styles.error}>
                          {props.errors.confirmPassword}
                        </Text>
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
                      <Text>Submit</Text>
                    </Button>
                    <Button
                      block
                      onPress={() => navigation.navigate("Signin")}
                      style={{
                        backgroundColor: ColorConstants.DGreen,
                        marginBottom: 16,
                      }}
                    >
                      <Text>Login</Text>
                    </Button>

                    {/* <Button
                      onPress={props.handleReset}
                      disabled={props.isSubmitting}
                      danger
                      block
                      style={{
                        marginTop: 16,
                      }}
                    >
                      <Text>Reset</Text>
                    </Button> */}
                  </Grid>
                )}
              </Formik>
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
