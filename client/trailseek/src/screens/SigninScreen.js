import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Image } from "react-native";
import { Text, Button } from "react-native-elements";
import { useSelector, useDispatch, unwrapResult } from "react-redux";
import { signIn } from "../app/userSlice";
// import Toast from "react-native-simple-toast";
import ToastAlert from "../components/ToastAlert";
// import { setToken, setUser } from "../app/actions/index";

const SigninScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const [log, setLog] = useState(null);

  const inputsHandler = (e, field) => {
    setInputs((inputs) => ({ ...inputs, [field]: e }));
  };
  const dispatch = useDispatch();

  // const token = useSelector((state) => state.user.token);
  const userStatus = useSelector((state) => state.user.status);
  const authError = useSelector((state) => state.user.authError);
  const error = useSelector((state) => state.user.error);

  // TODO
  // const login = async () => {
  //   try {
  //     const resultActions = await dispatch(signIn({ inputs }));
  //     const user = unwrapResult(resultActions);
  //     console.log(user);
  //     // if (userStatus === "succeeded" && !authError)
  //     //   navigation.navigate("MainTab");
  //     // } else {
  //     //   Toast.show(error, Toast.LONG);
  //     // }
  //   } catch (e) {
  //     Toast.show(e, Toast.LONG);
  //   }

  //   //
  // };
  // useEffect(() => {
  //   // each useEffect can return a cleanup function
  //   return () => {
  //     componentIsMounted.current = false;
  //   };
  // }, []);

  const login = async () => {
    try {
      let res = await dispatch(signIn({ inputs }));
      if (res.payload.token) {
        setLog(res);
        navigation.navigate("MainTab");
      }
    } catch (e) {
      ToastAlert(e.message);
    }

    console.log("Signin");
    // console.log(res);
    if (userStatus === "succeeded" && !authError) {
      navigation.navigate("MainTab");
    } else if (userStatus === "failed" || authError) {
      ToastAlert(error);
      // Toast.show(error, Toast.LONG);
    }
  };

  // useEffect(() => {
  //   if (userStatus === "succeeded") {
  //     navigation.navigate("MainTab");
  //   } else if (userStatus === "failed" || authError) {
  //     ToastAlert(error);
  //     // Toast.show(error, Toast.LONG);
  //   }
  // }, [userStatus]);

  return (
    <>
      {/* <Text h3>SigninScreen</Text>
            <Button title='Sign up' onPress={()=>navigation.navigate('Signup')} />
            <Button title='Login' onPress={()=>navigation.navigate('MainTab')} /> */}
      {/* <Button title='Skip' onPress={()=>navigation.navigate('MainTab')} /> */}

      {/* <Text h3>SigninScreen</Text> */}
      <View style={styles.container}>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <View style={styles.containerhead}>
          <Image
            source={require("../images/sublogo.png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
        </View>

        <View style={styles.containerform}>
          <TextInput
            onChangeText={(e) => inputsHandler(e, "email")}
            // value={this.state.email}
            // onChangeText={(email) => this.setState({ email })}
            placeholder={"Email"}
            style={styles.input}
          />
          <TextInput
            // value={this.state.password}
            // onChangeText={(password) => this.setState({ password })}
            onChangeText={(e) => inputsHandler(e, "password")}
            placeholder={"Password"}
            secureTextEntry={true}
            style={styles.input}
          />

          <View style={styles.containerbuttons}>
            <Button
              title={"Login"}
              style={styles.input}
              buttonStyle={styles.button}
              onPress={login}
              // onPress={()=>this.addBlogPost}
            />
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
            title={"Skip "}
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
