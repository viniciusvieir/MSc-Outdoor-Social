import React,{useEffect,useState} from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList,Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, Rating } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import trailSeek from '../api/trailSeek'
import {Intersect} from '../util/Intersect'

const TrailCards =  ({getParams}) =>{

    const { query, title} = getParams;
    const [data, setData] = useState([]);

    const navigation = useNavigation();

    useEffect(()=>{
        async function fetchIDs(){
            try{
                const response = await trailSeek.get('/trails',{
                params:{
                    fields:"_id",
                    limit:10,
                    q:query
                }
                });
                setData(response.data)
            }
            catch(error){
                console.log(error);
            };
        }
        fetchIDs();
    },[trails])

    const trails = useSelector(state=>Intersect(state.trails.trails,data))

    // if (trailStatus === 'loading'){
    //     content = <ActivityIndicator />
    // } else if (trailStatus==='failed'){
    //     content=<Text>{error}</Text>
    // } else if (trailStatus==='succeeded'){
 
    // }

    return (
        <View>
            <Text h4 style={styles.titleStyle}>{title}</Text>
            <FlatList
                horizontal
                data={trails}
                keyExtractor={(trails)=>{
                    return trails._id
                }}
                renderItem={({ item })=>{
                    return(
                        <ScrollView horizontal style={{maxHeight:275}}>
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('ViewTrail',{id:item._id, name: item.name})}}      
                            >
                                <View style={{flexShrink: 1}}>
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
                                            <Rating 
                                                imageSize={15} 
                                                readonly 
                                                startingValue={item.avg_rating} 
                                                style={styles.rating} 
                                                // ratingBackgroundColor='red'
                                                // tintColor='none'
                                                type='custom'
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    );
                }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );

};

const styles = StyleSheet.create({
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
        marginLeft:5
    },
    locationStyle:{
        marginLeft:5,
        width:160
    },
    titleStyle:{
        marginLeft:10
    },
    caption:{
        width:250,
        marginLeft:5
    },
    rateloc:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating:{
        
    }


});

export default TrailCards;