import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image,ActivityIndicator } from 'react-native';
import MapView,{ Polyline } from 'react-native-maps';
import { Text, Button, Tile } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import StarRating from 'react-native-star-rating';
import { fetchTrailsByID} from '../app/trailSlice';


const ViewTrailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const dispatch = useDispatch();

    const trailStatus = useSelector(state=> state.trails.statusID);
    const loadedID = useSelector(state=> state.trails.loadedID);
    const error = useSelector(state=>state.trails.errorID);
    const fields = 'name,avg_rating,location,path,bbox,img_url,difficulty,length_km,description,activity_type,estimate_time_min';
    let idx;
    useEffect(()=>{
        idx = loadedID.findIndex(a=>a===id)
        if (idx === -1){  
            dispatch(fetchTrailsByID({fields,id}));
        }
    },[])
    const trailData = useSelector(state=>state.trails.trailDetails.find(item=>item._id===id))
    let content;
    if(trailData){
        content = <>
                    <Tile
                            imageSrc={{ uri: trailData.img_url }}
                            title={trailData.name}
                            featured
                            activeOpacity={1}
                            height={230}
                            titleStyle={{fontWeight: '600',
                                        color:'white',
                                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                        textShadowOffset: {width: -1, height: 1},
                                        textShadowRadius: 10}}
                        />
                    <Text>Difficulty : {trailData.difficulty}</Text>
                    <Text>Length : {trailData.length_km}</Text>
                    <StarRating
                        disabled={true}
                        emptyStar={'ios-star-outline'}
                        fullStar={'ios-star'}
                        halfStar={'ios-star-half'}
                        iconSet={'Ionicons'}
                        maxStars={5}
                        rating={trailData.avg_rating}
                        fullStarColor={'gold'}
                        starSize={20}
                    />
                    <Text>Est Time : {trailData.estimate_time_min}</Text>
                    <Text>Description : {trailData.description}</Text>
                    <Text>activity : {trailData.activity_type}</Text>
                    <Text>location : {trailData.location}</Text>
                    <MapView 
                        style={styles.mapStyle}
                        initialRegion={{
                            latitude:(trailData.bbox[1] + trailData.bbox[3])/2,
                            longitude:(trailData.bbox[0] + trailData.bbox[2])/2,
                            latitudeDelta: 0.0422,
                            longitudeDelta: 0.0121,
                        }}
                    >
                        <Polyline
                            coordinates={trailData.path}
                            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeWidth={3}
                        />
                    </MapView>
                </>
    } else {
        content=<ActivityIndicator size="large" />
    }
    return(
        <View>
            {content}
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