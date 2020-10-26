import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { Text, Button } from 'react-native-elements';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { setToken, setUser } from "../app/actions/index";

const SigninScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);

  const inputsHandler = (e, field) => {
    setInputs(inputs => ({ ...inputs, [field]: e }));
  }
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);


  const login = () => {
    setError(null);
    return axios.post("https://api.trailseek.eu/v1/signin", inputs)
      .then((response) => {
        dispatch(setUser(response.data));
        dispatch(setToken(response.data.token));
        navigation.navigate('MainTab');
      })
      .catch(function (error) {
        console.log(error)
        if (error.response) {
          setError(error.response.data.errors[0].msg);
        }
      });
  }

  return (
    <>
      {/* <Text h3>SigninScreen</Text>
            <Button title='Sign up' onPress={()=>navigation.navigate('Signup')} />
            <Button title='Login' onPress={()=>navigation.navigate('MainTab')} /> */}
      {/* <Button title='Skip' onPress={()=>navigation.navigate('MainTab')} /> */}

      {/* <Text h3>SigninScreen</Text> */}
      <View style={styles.container}>
        {error &&
          <Text style={{ color: "red" }}>{error}</Text>
        }
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
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            // value={this.state.password}
            // onChangeText={(password) => this.setState({ password })}
            onChangeText={(e) => inputsHandler(e, "password")}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />

          <View style={styles.containerbuttons}>

            <Button
              title={'Login'}
              style={styles.input}
              buttonStyle={styles.button}
              onPress={login}
            // onPress={()=>this.addBlogPost}
            />
            <Button
              title={'Sign up'}
              onPress={() => navigation.navigate('Signup')}
              type={'outline'}
              buttonStyle={styles.button}
            />


          </View>
        </View>

        <View style={styles.containerfooter}>
          <Button
            title={'Skip '}
            onPress={() => navigation.navigate('MainTab')}
            type={'clear'}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',

  },
  containerhead: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  containerform: {
    flex: 2,
    alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
  },

  input: {
    width: '80%',
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },

  containerbuttons: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'stretch',

  },
  containerfooter: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',

  },

  button: {
    marginBottom: 10,

  },

  image: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
  },

});

export default SigninScreen;