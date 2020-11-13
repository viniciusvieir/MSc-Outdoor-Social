import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Image,
  Keyboard,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Text, Container } from "native-base";
import { RadioButtons } from "react-native-radio-buttons";

import ToastAlert from "../components/ToastAlert";
import { signUp } from "../app/userSlice";

import moment from "moment";
import ColorConstants from "../util/ColorConstants";

const SignupScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const [log, setLog] = useState(null);
  const [auth, setAuth] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dobval, setDobval] = useState("");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setDobval(moment(currentDate).format("DD-MMMM-YYYY"));
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
    Keyboard.dismiss();
  };

  const inputsHandler = (e, field) => {
    setInputs((inputs) => ({ ...inputs, [field]: e }));
  };
  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.user.profile.status);
  const error = useSelector((state) => state.user.profile.error);
  const isAuth = useSelector((state) => state.user.isAuth);

  const options = ["M", "F"];

  const [selectedOption, setSelectedOption] = useState("M");

  function renderOption(option, selected, onSelect, index) {
    const style = selected
      ? {
          fontWeight: "bold",
          color: ColorConstants.DWhite,
          fontSize: 22,
          marginHorizontal: 10,
        }
      : { color: ColorConstants.DWhite, fontSize: 22, marginHorizontal: 10 };
    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        <Text style={style}>{option == "M" ? "Male" : "Female"}</Text>
      </TouchableWithoutFeedback>
    );
  }

  function renderContainer(optionNodes) {
    return <View style={{ flexDirection: "row" }}>{optionNodes}</View>;
  }
  const onSignup = async () => {
    try {
      const res = await dispatch(signUp({ inputs }));
      const user = unwrapResult(res);
      setAuth(isAuth);
      navigation.navigate("Signin");
    } catch (e) {
      // ToastAlert(e.response);
      ToastAlert(error);
    }
  };
  console.log(inputs);
  return (
    <Container>
      <ImageBackground
        source={require("../images/sigininbg.jpg")}
        style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
      >
        <View style={styles.container}>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <View style={styles.containerhead}>
            <Image
              source={require("../images/tslogov2.2grey.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.containerform}>
            {error && <Text style={{ color: "red" }}>{error}</Text>}
            <TextInput
              onChangeText={(e) => inputsHandler(e, "name")}
              placeholder={"Name"}
              style={styles.input}
            />
            <TextInput
              onChangeText={(e) => inputsHandler(e, "dob")}
              onFocus={() => showDatepicker()}
              value={dobval}
              placeholder={"DOB"}
              style={styles.input}
            />
            {/* <TextInput
              placeholder={"Gender"}
              onChangeText={(e) => inputsHandler(e, "gender")}
              style={styles.input}
            /> */}

            <TextInput
              onChangeText={(e) => inputsHandler(e, "email")}
              autoCompleteType="email"
              placeholder={"Email"}
              style={styles.input}
            />
            <TextInput
              onChangeText={(e) => inputsHandler(e, "password")}
              placeholder={"Password"}
              secureTextEntry={true}
              style={styles.input}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                borderRadius: 10,
                backgroundColor: "#ffffff30",
                width: 330,
                marginBottom: 10,
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: ColorConstants.DWhite,
                  fontSize: 20,
                }}
              >
                Gender :{" "}
              </Text>
              <RadioButtons
                options={options}
                onSelection={(item) => {
                  setSelectedOption(item);
                  inputsHandler(selectedOption, "gender");
                }}
                selectedOption={selectedOption}
                renderOption={renderOption}
                renderContainer={renderContainer}
              />
            </View>
            <View style={styles.flexxx}>
              <Button
                title={"Sign up"}
                onPress={() => onSignup()}
                buttonStyle={styles.button}
                titleStyle={{ color: ColorConstants.Black }}
              />
              <Button
                title={"Login"}
                onPress={() => navigation.navigate("Signin")}
                buttonStyle={{ backgroundColor: ColorConstants.DGreen }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorConstants.LGreen + 90,
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
    borderRadius: 10,
    backgroundColor: ColorConstants.DWhite,
  },

  flexxx: {
    width: "80%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  image: {
    width: "100%",
    height: 120,
    alignSelf: "center",
  },

  button: {
    marginBottom: 10,
    backgroundColor: ColorConstants.Yellow,
  },
});
