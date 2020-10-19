import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';

const SigninScreen = ({ navigation }) => {
    return(
        <>
            <Text h3>SigninScreen</Text>
            <Button title='Sign up' onPress={()=>navigation.navigate('Signup')} />
            <Button title='Login' onPress={()=>navigation.navigate('MainTab')} />
            {/* <Button title='Skip' onPress={()=>navigation.navigate('MainTab')} /> */}
        </>
    );
};

const styles = StyleSheet.create({});

export default SigninScreen;

// import React, { Component } from 'react';
// import { Alert, TextInput, View, StyleSheet } from 'react-native';
// import { Text, Button, ButtonGroup  } from 'react-native-elements';
// import axios from 'axios';
// import ReactDOM from "react-dom";


// export default class SigninScreen extends Component {
//   constructor(props) {
//     super(props);
    
//     this.state = {
//       email: '',
//       password: '',
//     };
    
//   }
  
//   onLogin() {
//     // const { email, password } = this.state;
//     const email = this.state.email;
//     const password = this.state.password;

//     fetch('https://api.trailseek.eu/v1/signin', {
//       method: 'POST',
//       body: JSON.stringify({
//         email: email,
//         password: password,
//       }),
//     }).then(response => {
//       if (response.status === 200) {
//         global.loggedin = response;
//         this.props.navigation.navigate('MainTab');
//       } else {
//         throw new Error('Something went wrong on api server!');
//       }
//     })
//     .then(response => {
//       console.debug(response);
//       // ...
//     }).catch(error => {
//       console.error(error);
//     });

//     // this.props.navigation.navigate('MainTab');

//   }

//   render() {

//     if(global.loggedin == null){
//       console.log('stay here');
//     }else{
//       console.log('navigate to profile');
//     }

//     const buttons = [ 'Sign up', 'Login']
//     const { selectedIndex } = this.state

//     return (
//       <View style={styles.container}>
        
//         <TextInput
//           value={this.state.email}
//           onChangeText={(email) => this.setState({ email })}
//           placeholder={'Email'}
//           style={styles.input}
//         />
//         <TextInput
//           value={this.state.password}
//           onChangeText={(password) => this.setState({ password })}
//           placeholder={'Password'}
//           secureTextEntry={true}
//           style={styles.input}
//         />
 
//         <View style={styles.flexxx}>
          
//           <Button
//             title={'Login'}
//             style={styles.input}
//             buttonStyle={styles.button}
//             onPress={this.onLogin.bind(this)}

//           /> 
//           <Button 
//             title={'Sign up'} 
//             onPress={()=>this.props.navigation.navigate('Signup')} 
//             type={'clear'} 
//           />          
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//   },
  
//   input: {
//     width: '80%',
//     height: 44,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: 'black',
//     marginBottom: 10,
//   },

//   flexxx:{
//     width:'80%',
//     flexDirection: 'column',
//     alignItems:'stretch',
//   }
// });
