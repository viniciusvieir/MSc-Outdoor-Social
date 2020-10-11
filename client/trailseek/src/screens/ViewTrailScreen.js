import React from 'react';
import { View, StyleSheet, Map, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Text, Button } from 'react-native-elements';

const ViewTrailScreen = ({ navigation }) => {
    return(
        <>
            <Text h3>ViewTrailScreen</Text>
            <MapView style={styles.mapStyle}></MapView>
            <Button title='Create Event' onPress={()=>{navigation.navigate('CreateEvent')}}/>
            <Button title='Join Event' onPress={()=>{navigation.navigate('ListEvent')}}/>
        </>
    );
};

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: 400,
      },
});

export default ViewTrailScreen;