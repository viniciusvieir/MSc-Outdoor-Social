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