import React from 'react';
import { Alert, TextInput, View, StyleSheet, Image} from 'react-native';
import { Text, Button, ButtonGroup  } from 'react-native-elements';
import jsonServer from '../files/JsonServer';
// const constructor = (props) =>  {
//   super(props);
  
//   this.state = {
//     email: '',
//     password: ''
//   };

// }

const SigninScreen = ({ navigation}) => {

  // this.setState({email:'', password:''});

  const addBlogPost = (dispatch) =>{
    console.log('danish jamil')
    return async (title, content, callback)=>{
        await jsonServer.post('/signin',{email:title, password:content}).then((response) =>{
            console.log(response);
          })
        // dispatch({ type: 'add_blogpost', payload: {title, content} });
        if (callback){
            callback();
        }
    };
  };

  return(
      <>
          
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
          // value={this.props.email}
          // onChangeText={(email) => this.setState({ email })}
          placeholder={'Email'}
          style={styles.input}
        />
        <TextInput
          // value={this.state.password}
          // onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />

        <View style={styles.containerbuttons}>
          
          <Button
            title={'Login'}
            style={styles.input}
            buttonStyle={styles.button}
            // onPress={this.onLogin.bind(this)}
            onPress={()=>this.addBlogPost}
          />            
          <Button 
            title={'Sign up'} 
            onPress={()=>navigation.navigate('Signup')} 
            type={'outline'} 
            buttonStyle={styles.button}
          />

        </View>
      </View>

      <View style={styles.containerfooter}>
      <Button 
            title={'Skip '} 
            // onPress={()=>navigation.navigate('MainTab')} 
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

export default SigninScreen;