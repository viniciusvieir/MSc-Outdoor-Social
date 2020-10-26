import React,{useEffect,useState} from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList,Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';


import trailSeek from '../api/trailSeek'
import {Intersect} from '../util/Intersect'

const TrailCards =  ({getParams,gps}) =>{
    const { query, title} = getParams;
    const [data, setData] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const navigation = useNavigation();

    //Location Change the implementation for later ToDO!!!

    const getLocation = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }
        let location1 = await Location.getCurrentPositionAsync({});
        setLocation(location1);
    }

    if(gps){
        useEffect(() => {
            getLocation();
        }, []);
    }
    useEffect(() => {
      if(location){
        async function fetchIDs() {
            try {        
                const response = await trailSeek.get('/trails', {
                    params: {
                        fields: "_id",
                        limit: 10,
                        q: {
                            "start":{
                                "$near":{
                                    "$geometry":{
                                        "type":"Point",
                                        "coordinates":[location.coords.latitude,location.coords.longitude]
                                    },
                                    "$minDistance": 1000,
                                    "$maxDistance": 5000
                                },
                            }
                            
                        }
                    }
                });
                setData(response.data);
            }
            catch (error) {
                console.log(error);
            };
        }
        fetchIDs();
      }
    },[location])

    //No Location
    if(!gps){
            useEffect(()=>{
            async function fetchIDs() {
                try {
                    const response = await trailSeek.get('/trails', {
                        params: {
                            fields: "_id",
                            limit: 10,
                            q: query
                        }
                    });
                    setData(response.data);
                }
                catch (error) {
                    console.log(error);
                };
            }
            fetchIDs()
        },[data]);
    }
    const trails = useSelector(state=>Intersect(state.trails.trails,data))

    return (
        <View style={styles.card}>
            <Text h4 style={styles.titleStyle}>{title}</Text>
            <ScrollView 
                horizontal 
                style={{maxHeight:275}}
                showsHorizontalScrollIndicator={false}
            >
            <FlatList
                horizontal
                data={trails}
                keyExtractor={(trails)=>{
                    return trails._id
                }}
                renderItem={({ item })=>{
                    return(
                        <TouchableOpacity
                            onPress={()=>{navigation.navigate('ViewTrail',{id:item._id, name: item.name})}}      
                        >
                            <View style={styles.listitem}>
                            <Image
                                source={{ uri: item.img_url }}
                                style={styles.imageStyle}
                                PlaceholderContent={<ActivityIndicator />}
                                resizeMethod='auto'
                                resizeMode='cover'
                            />
                                <View style={styles.caption}>
                                    <Text style={styles.nameStyle}>{item.name}</Text>
                                    <View style={styles.rateloc}>
                                        <Text style={styles.locationStyle}>{item.location}</Text>
                                        <StarRating
                                            disabled={true}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            rating={item.avg_rating}
                                            fullStarColor={'gold'}
                                            starSize={20}
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>                       
                    );
                }}   
            />
            { trails.length>=10?
                <TouchableOpacity 
                        style={styles.viewMore}
                        onPress={()=>{navigation.navigate('ListTrail',{getParams})}}
                    >
                        <AntDesign name="right" size={24} color="black" style={{alignSelf:'center'}}/>
                        <Text style={{fontSize:10}}>View More</Text>
                </TouchableOpacity>
                :null
            }
            </ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
    listitem:{
        flexShrink: 1,
        borderRadius:5,
        marginBottom:5,
        marginTop:5,
        
    },
    card:{
        backgroundColor:'#fff',
        marginTop:8,
        borderRadius:8,
        
        
    },
    imageStyle:{
        borderRadius:3,
        width:250,
        height:175,
        marginBottom:5,
        marginLeft:10
    },
    nameStyle:{
        fontWeight:"800",
        fontSize:18,
        flexShrink:1,
        marginLeft:5,
        color:'#404040',
    },
    locationStyle:{
        marginLeft:5,
        width:160,
        color:'#666666',
    },
    titleStyle:{
        marginLeft:10,
        color:'#395693',
    },
    caption:{
        width:250,
        marginLeft:5,
    },
    rateloc:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating:{
        height:5,
        width:10
    },
    viewMore:{
        height:200,
        // borderWidth:5,
        // borderColor:'red',
        justifyContent:'center',
        marginLeft:5
    }

});

export default TrailCards;