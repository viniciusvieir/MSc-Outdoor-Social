import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image,ActivityIndicator } from 'react-native';
import MapView,{ Polyline } from 'react-native-maps';
import { Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import { fetchTrailsByID} from '../app/trailSlice';


const ViewTrailScreen = ({ route, navigation }) => {
    const { id, name } = route.params;
    const dispatch = useDispatch();

    const trailStatus = useSelector(state=> state.trails.statusID);
    const loadedID = useSelector(state=> state.trails.loadedID);
    const error = useSelector(state=>state.trails.errorID);

    const fields = 'name,avg_rating,location,path,bbox,img_url,difficulty,length_km';

    useEffect(()=>{
        const idx = loadedID.findIndex(a=>a===id)
        if (idx === -1){  
            dispatch(fetchTrailsByID({fields,id}));
        }
    },[])

    const trailData = useSelector(state=>state.trails.trails.find(item=>item._id===id))

    let plines;
    if(trailData.path){
        plines = <Polyline
                    coordinates={trailData.path}
                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={3}
                />
    }
    return(
        <View>
            <Image
                source={{ uri: trailData.img_url }}
                style={styles.imageStyle}
                PlaceholderContent={<ActivityIndicator />}
                resizeMethod='auto'
                resizeMode='cover'
            />
           
    <Text>Difficulty : {trailData.difficulty}</Text>
    <Text>Length : {trailData.length_km}</Text>
    <Text>Rating : {trailData.avg_rating}</Text>
            <MapView style={styles.mapStyle}
            // initialRegion={{
            //     latitude:(trailData.bbox.coordinates[0][0][0] + trailData.bbox.coordinates[0][2][0])/2,
            //     longitude:(trailData.bbox.coordinates[0][0][1] + trailData.bbox.coordinates[0][1][1])/2,
            //     latitudeDelta: 0.0522,
            //     longitudeDelta: 0.0121,
            //   }}
            >
                {plines}
            </MapView>


            <Button title='Create Event' onPress={()=>{navigation.navigate('CreateEvent')}}/>
            <Button title='Join Event' onPress={()=>{navigation.navigate('ListEvent')}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: 275,
      },
    imageStyle:{
        width:Dimensions.get('window').width,
        height:175,
        marginBottom:5,
    },
});

export default ViewTrailScreen;