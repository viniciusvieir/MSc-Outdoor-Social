// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Text, Button } from 'react-native-elements';

// const SignupScreen = ({ navigation }) => {
//     return(
//         <>
//             <Text h3>SignupScreen</Text>
//             <Button title='Submit' onPress={()=>{navigation.navigate('Signin')}} />
//         </>
//     );
// };

// const styles = StyleSheet.create({});

// export default SignupScreen;


import React, { Component } from 'react';
import { Alert, TextInput, View, StyleSheet, Image } from 'react-native';
import { Text, Button, ButtonGroup  } from 'react-native-elements';
import axios from 'axios';
import ReactDOM from "react-dom";


export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
    };
  }
  
  onSignup() {
    // const { email, password } = this.state;
    const name = this.state.name;
    const dob = this.state.dob;
    const gender = this.state.gender;
    const email = this.state.email;
    const password = this.state.password;

    // fetch('https://api.trailseek.eu/v1/signup', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     name:name,
    //     dob:dob,
    //     gender:gender,
    //     email: email,
    //     password: password,
    //   }),
    // }).then(response => {
    //   if (response.status === 200) {
    //     global.loggedin = response;
    //     this.props.navigation.navigate('MainTab');
    //   } else {
    //     throw new Error('Something went wrong on api server!');
    //   }
    // })
    // .then(response => {
    //   console.debug(response);
    //   // ...
    // }).catch(error => {
    //   console.error(error);
    // });

    this.props.navigation.navigate('MainTab');

  }

  render() {

    if(global.loggedin == null){
      console.log('stay here');
    }else{
      console.log('navigate to profile');
    }

    const buttons = [ 'Sign up', 'Login']
    const { selectedIndex } = this.state

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
          <TextInput
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            placeholder={'Name'}
            style={styles.input}
          />
                  <TextInput
            value={this.state.dob}
            onChangeText={(dob) => this.setState({ dob })}
            placeholder={'DOB'}
            style={styles.input}
          />
          <TextInput
            value={this.state.gender}
            onChangeText={(gender) => this.setState({ gender })}
            placeholder={'Gender'}
            style={styles.input}
          />

          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
    
            <View style={styles.flexxx}>
              <Button 
                title={'Sign up'} 
                // onPress={()=>this.props.navigation.navigate('Signup')} 
                onPress={this.onSignup.bind(this)}
                buttonStyle={styles.button}            
              />              
              <Button
                title={'Login'}
                type={'clear'} 
                // onPress={this.onLogin.bind(this)}
                onPress={()=>this.props.navigation.navigate('Signin')} 
              /> 
          
            </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  containerhead:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
  },
  containerform:{
    flex: 2,
    alignItems: 'center',
    // justifyContent: 'center',
    width:'100%',
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

  flexxx:{
    width:'80%',
    flexDirection: 'column',
    alignItems:'stretch',
  },
  image: {
    width: '100%',
    height: 120,
    alignSelf:'center',
  },
  
  button:{
    marginBottom:10,
  },
});
