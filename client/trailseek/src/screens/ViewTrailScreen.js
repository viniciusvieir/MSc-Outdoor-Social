import React from 'react';
import { View, StyleSheet, Map, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Text, Button } from 'react-native-elements';
import {useSelector} from 'react-redux'

import { selectTrailsByID } from '../app/trailSlice';

const ViewTrailScreen = ({ route, navigation }) => {
    const { id, name } = route.params;

    const trailData = useSelector(selectTrailsByID(id))
    console.log(trailData)

    return(
        <>
            <Text h3>{name}</Text>
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