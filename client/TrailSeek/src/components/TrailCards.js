import React,{useEffect,useState} from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList,Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import { AntDesign } from '@expo/vector-icons';


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

    return (
        <View>
            <Text h4 style={styles.titleStyle}>{title}</Text>
            <ScrollView horizontal style={{maxHeight:275}}>
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
                                            {/* <Rating
                                                type='custom'
                                                readonly
                                                ratingImage={{uri:'./images/star.png'}}
                                                startingValue={item.avg_rating}
                                                starContainerStyle={styles.rating}
                                            /> */}
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            
                        
                    );
                }}
                showsHorizontalScrollIndicator={false}
            />
            <TouchableOpacity 
                style={styles.viewMore}
                onPress={()=>{navigation.navigate('ListTrail',{getParams})}}
            >
                <AntDesign name="right" size={24} color="black" style={{alignSelf:'center'}}/>
                <Text style={{fontSize:10}}>View More</Text>
            </TouchableOpacity>
            </ScrollView>
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