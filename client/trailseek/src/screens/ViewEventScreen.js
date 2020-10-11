import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';

const ViewEventScreen = ({ navigation }) => {
    return(
        <>
            <Text h3>ViewEventScreen</Text>
            <Button title='Edit Event' onPress={()=>{navigation.navigate('EditEvent')}} />
        </>
    );
};

const styles = StyleSheet.create({});

export default ViewEventScreen;