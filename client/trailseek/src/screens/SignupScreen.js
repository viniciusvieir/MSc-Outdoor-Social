import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Image, AsyncStorage } from 'react-native';
import { Text, Button } from 'react-native-elements';
import axios from 'axios';


const SignupScreen = ({ navigation }) => {
  const list = [
    {
      name: 'Event0',
      subtitle: 'Location'
    },
    {
      name: 'Event1',
      subtitle: 'Location'
    },
  ];
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);

  const inputsHandler = (e, field) => {
    setInputs(inputs => ({ ...inputs, [field]: e }));
  }

  const onSignup = () => {
    setError(null);
    axios.post("https://api.trailseek.eu/v1/signup", inputs)
      .then(async (response) => {
        try {
          await AsyncStorage.setItem(
            '@trailSeek:token',
            response.data.token
          );
        } catch (error) {
          // Error saving data
          console.log(error);
        }
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
    <View style={styles.container}>

      <View style={styles.containerhead}>
        <Image
          source={require("../images/sublogo.png")}
          resizeMode="contain"
          style={styles.image}
        ></Image>
      </View>
      <View style={styles.containerform}>
        {error &&
          <Text style={{ color: "red" }}>{error}</Text>
        }
        <TextInput
          onChangeText={(e) => inputsHandler(e, "name")}
          placeholder={'Name'}
          style={styles.input}
        />
        <TextInput
          onChangeText={(e) => inputsHandler(e, "dob")}
          placeholder={'DOB'}
          style={styles.input}
        />
        <TextInput
          placeholder={'Gender'}
          onChangeText={(e) => inputsHandler(e, "gender")}
          style={styles.input}
        />

        <TextInput
          onChangeText={(e) => inputsHandler(e, "email")}
          placeholder={'Email'}
          style={styles.input}
        />
        <TextInput
          onChangeText={(e) => inputsHandler(e, "password")}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />

        <View style={styles.flexxx}>
          <Button
            title={'Sign up'}
            onPress={onSignup}
            buttonStyle={styles.button}
          />
          <Button
            title={'Login'}
            type={'clear'}
            onPress={() => navigation.navigate('Signin')}
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

  flexxx: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  image: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
  },

  button: {
    marginBottom: 10,
  },
});
