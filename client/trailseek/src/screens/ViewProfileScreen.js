import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';

const ViewProfileScreen = ({ navigation }) => {
    return(
        <>
            <Text h3>ViewProfileScreen</Text>
            <Button title='Edit Profile' onPress={()=>{navigation.navigate('EditProfile')}} />
        </>
    );
};

const styles = StyleSheet.create({});

export default ViewProfileScreen;