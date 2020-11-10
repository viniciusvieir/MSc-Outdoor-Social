import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import ToastAlert from "../components/ToastAlert";

import { signUp } from "../app/userSlice";
// import { setToken, setUser } from "../app/actions/index";

const SignupScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const [log, setLog] = useState(null);

  const inputsHandler = (e, field) => {
    setInputs((inputs) => ({ ...inputs, [field]: e }));
  };
  const dispatch = useDispatch();

  // const token = useSelector((state) => state.user.token);
  const userStatus = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const isAuth = useSelector((state) => state.user.isAuth);

  // const onSignup = () => {
  //   dispatch(signUp({ inputs }));
  //   if (userStatus === "succeeded") navigation.navigate("MainTab");
  // };

  const onSignup = async () => {
    let res = await dispatch(signUp({ inputs })).catch((err) => {
      ToastAlert(err.message);
    });
    setLog(res);
    if (userStatus === "succeeded" && isAuth) {
      navigation.navigate("Signin");
    }
  };

  useEffect(() => {
    if (userStatus === "succeeded" && isAuth) {
      navigation.navigate("MainTab");
    } else if (userStatus === "failed") {
      ToastAlert(error);
    }
  }, [userStatus]);

  return (
    <View style={styles.container}>
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
          placeholder={"DOB"}
          style={styles.input}
        />
        <TextInput
          placeholder={"Gender"}
          onChangeText={(e) => inputsHandler(e, "gender")}
          style={styles.input}
        />

        <TextInput
          onChangeText={(e) => inputsHandler(e, "email")}
          placeholder={"Email"}
          style={styles.input}
        />
        <TextInput
          onChangeText={(e) => inputsHandler(e, "password")}
          placeholder={"Password"}
          secureTextEntry={true}
          style={styles.input}
        />

        <View style={styles.flexxx}>
          <Button
            title={"Sign up"}
            onPress={() => onSignup()}
            buttonStyle={styles.button}
          />
          <Button
            title={"Login"}
            type={"clear"}
            onPress={() => navigation.navigate("Signin")}
          />
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

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
  },
});
