import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Image } from "react-native";
import { Text, Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { createSlice, createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { signIn } from "../app/userSlice";
import ToastAlert from "../components/ToastAlert";
import {useForm, Controller} from "react-hook-form";
import { color } from "react-native-reanimated";

const SigninScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const [auth, setAuth] = useState(false);

  const inputsHandler = (e, field) => {
    setInputs((inputs) => ({ ...inputs, [field]: e }));
  };
  const dispatch = useDispatch();

  const error = useSelector((state) => state.user.profile.error);
  const isAuth = useSelector((state) => state.user.isAuth);

  const login = async () => {
    console.log("inputs", inputs);
    try {
      const res = await dispatch(signIn({ inputs }));
      const user = unwrapResult(res);
      setAuth(isAuth);
      navigation.navigate("MainTab");
      
      //clearing inputs object after login
      [inputs, setInputs] = useState({});
      
    } catch (e) {
      console.log(error)
      ToastAlert(error);
    }
  };

  const {register, control, handleSubmit, errors } = useForm();

  // const onSubmit = data => {
  //   inputsHandler(data.email, "email")
  //   inputsHandler(data.password, "password")
  //   console.log(inputs)
  // }

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  return (
    <>
      <View style={styles.container}>
        {error && <Text style={{ color: "red" }}>{auth}</Text>}
        <View style={styles.containerhead}>
          <Image
            source={require("../images/sublogo.png")}
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
                  onChange(value)
                  inputsHandler(value, "email")
                }}
                value={value}
                placeholder={"Email"}
            />
            )}
            name="email"
            type="email"
            rules={{
              required: { value: true, message: 'Email is required' },
              pattern: {
                value: EMAIL_REGEX,
                message: 'Not a valid email'
              }
            }}
            defaultValue=""
          />
          {errors.email && <Text>{errors?.email?.message}</Text>}

          {/* Password */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
            <TextInput
                style={styles.input}
                onBlur={onBlur}
                // onChangeText={value => onChange(value)}
                onChangeText={(value) => {
                  onChange(value)
                  inputsHandler(value, "password")
                }}
                value={value}
                placeholder={"Password"}
                secureTextEntry={true}
            />
            )}
            name="password"
            type="password"
            rules={{
              required: { value: true, message: 'Password is required' },
            }}
            defaultValue=""
          />
          {errors.password && <Text>{errors?.password?.message}</Text>}

          <View style={styles.containerbuttons}>

            <Button onPress={handleSubmit(login)} title="Login" buttonStyle={styles.button} />
            
            <Button
              title={"Sign up"}
              onPress={() => navigation.navigate("Signup")}
              type={"outline"}
              buttonStyle={styles.button}
            />
          </View>
        </View>

        <View style={styles.containerfooter}>
          <Button
            title={"Skip"}
            onPress={() => navigation.navigate("MainTab")}
            type={"clear"}
            buttonStyle={styles.button}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
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

  button: {
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: 120,
    alignSelf: "center",
  },
});

export default SigninScreen;
