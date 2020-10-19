// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Text, Button } from 'react-native-elements';

// const SigninScreen = ({ navigation }) => {
//     return(
//         <>
//             <Text h3>SigninScreen</Text>
//             <Button title='Sign up' onPress={()=>navigation.navigate('Signup')} />
//             <Button title='Login' onPress={()=>navigation.navigate('MainTab')} />
//             {/* <Button title='Skip' onPress={()=>navigation.navigate('MainTab')} /> */}
//         </>
//     );
// };

// const styles = StyleSheet.create({});

// export default SigninScreen;

import React, { Component } from 'react';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
import jsonServer from '../files/JsonServer';

import { Alert, TextInput, View, StyleSheet, Image} from 'react-native';
import { Text, Button, ButtonGroup  } from 'react-native-elements';

import ReactDOM from "react-dom";

import axios from 'axios';

export default class SigninScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: ''
    };

  }

  onLogin() {
    console.log(this.state.email, this.state.password);
  }

  render() {

    if(global.loggedin == null){
      console.log('stay here');
    }else{
      console.log('navigate to profile');
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
  
          <View style={styles.containerbuttons}>
            
            <Button
              title={'Login'}
              style={styles.input}
              buttonStyle={styles.button}
              onPress={this.onLogin.bind(this)}
              // onPress={()=>this.addBlogPost}
            />            
            <Button 
              title={'Sign up'} 
              onPress={()=>this.props.navigation.navigate('Signup')} 
              type={'outline'} 
              buttonStyle={styles.button}
            />


          </View>
        </View>

        <View style={styles.containerfooter}>
        <Button 
              title={'Skip '} 
              onPress={()=>this.props.navigation.navigate('MainTab')} 
              type={'clear'} 
              buttonStyle={styles.button}
            />
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

  containerbuttons:{
    width:'80%',
    flexDirection: 'column',
    alignItems:'stretch',
    
  },
  containerfooter:{
    width:'80%',
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems:'stretch',
    
  },
  
  button:{
    marginBottom:10,
    
  },

  image: {
    width: '100%',
    height: 120,
    alignSelf:'center',
  },

});
