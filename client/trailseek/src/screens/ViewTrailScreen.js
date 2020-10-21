import React from 'react';
import { View, StyleSheet, Map, Dimensions } from 'react-native';
import MapView,{ Polyline } from 'react-native-maps';
import { Text, Button } from 'react-native-elements';
import {useSelector} from 'react-redux'

import { selectTrailsByID } from '../app/trailSlice';

const ViewTrailScreen = ({ route, navigation }) => {
    const { id, name } = route.params;

    // console.log(useSelector(state => state));
    const trailData = useSelector(state=>state.trails.trails.find(item=>item.id===id))
    // console.log(trailData)
    // console.log(useSelector(state=>{return state}))
    console.log(trailData.geoLoc.coordinates[0].map(c=>({longitude:c[0],latitude:c[1]})))
    
    return(
        <>
            <Text h3>{name+id}</Text>
            <MapView style={styles.mapStyle}
            initialRegion={{
                latitude: (trailData.geoLoc.bbox[1]+trailData.geoLoc.bbox[3])/2,
                longitude: (trailData.geoLoc.bbox[0]+trailData.geoLoc.bbox[2])/2,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0121,
              }}
            >
            <Polyline
                coordinates={trailData.geoLoc.coordinates[0].map(c=>({longitude:c[0],latitude:c[1]}))}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeWidth={3}
            />
            </MapView>
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