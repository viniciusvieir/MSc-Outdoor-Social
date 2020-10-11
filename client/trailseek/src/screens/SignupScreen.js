import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';

const SignupScreen = ({ navigation }) => {
    return(
        <>
            <Text h3>SignupScreen</Text>
            <Button title='Submit' onPress={()=>{navigation.navigate('Signin')}} />
        </>
    );
};

const styles = StyleSheet.create({});

export default SignupScreen;