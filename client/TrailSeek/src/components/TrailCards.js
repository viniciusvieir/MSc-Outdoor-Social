import React from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList,Image } from 'react-native';
import { Text, Rating } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const TrailCards =  ({ title, trailList }) =>{
    const navigation = useNavigation();
    return(
        <View>
            <Text h4 style={styles.titleStyle}>{title}</Text>
            <FlatList
                horizontal
                data={trailList}
                keyExtractor={(trailList)=>{
                    return trailList.id
                }}
                renderItem={({ item })=>{
                    return(
                        <TouchableOpacity
                            onPress={()=>{navigation.navigate('ViewTrail',{id:item.id, name: item.name})}}      
                        >
                            <View style={{flexShrink: 1}}>
                            <Image
                                source={{ uri: item.imgUrl }}
                                style={styles.imageStyle}
                                PlaceholderContent={<ActivityIndicator />}
                                resizeMethod='auto'
                                resizeMode='cover'
                            />
                                <Text style={styles.nameStyle}>{item.name}</Text>
                                <Text style={styles.locationStyle}>{item.location}</Text>
                                {/* <Rating imageSize={20} readonly startingValue={5} style={styles.rating} /> */}
                            </View>
                        </TouchableOpacity>
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
        marginLeft:5
    },
    nameStyle:{
        fontWeight:'bold',
        fontSize:20,
        flexShrink:1,
        marginLeft:5
    },
    locationStyle:{
        marginLeft:5
    },
    titleStyle:{
        marginLeft:5
    }

});

export default TrailCards;