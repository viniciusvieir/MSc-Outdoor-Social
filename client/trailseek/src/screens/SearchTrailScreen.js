import React,{ useState,useEffect } from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
import { Text, SearchBar } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrails } from '../app/trailSlice'
import LoadSpinner from '../components/LoadSpinner';

import TrailCard from '../components/TrailCards';

const SearchTrailScreen = () => {
    const dispatch = useDispatch();

    const trailStatus = useSelector(state=> state.trails.status);
    const error = useSelector(state=>state.trails.error);

    let content,
        spinner = true
        
    //Initial Trail Fetch
    useEffect(()=>{
        if (trailStatus ==='idle'){
            const fields='name,avg_rating,location,img_url';
            const limit = 100000
            dispatch(fetchTrails({fields,limit}));
        }
    },[])

    const easyParams = {
        title:'Easy Trails',
        query:{
                "difficulty":"Easy",
                "length_km":{"$lt":5}
            }
    }

    const bestParams = {
        title:'Best Rated',
        query:{
                "avg_rating":{"$gt":4},
            }
    }

    const nearMe = {
        title:'Near You',
    }

    if (trailStatus === 'loading'){
        spinner = true
    } else if (trailStatus==='failed'){
        spinner = false
        content=<Text>{errorMsg}</Text>
    } else if (trailStatus==='succeeded'){
        spinner = false
        content=<ScrollView>
                    <TrailCard getParams={nearMe} gps={true}/>
                    <TrailCard getParams={easyParams} gps={false}/>
                    <TrailCard getParams={bestParams} gps={false}/>
                </ScrollView>
    }

    return(
        <View style={{marginTop:30,flex:1}}>
            <LoadSpinner visible={spinner} />
            <Text h3 style={{marginLeft:5}}>Hi! User</Text>
            <SearchBar 
                style={styles.searchbar}
                lightTheme={true}
            />
            {content}
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        width:'100%',
    },
    texth3: {
        fontSize:30,
        fontWeight:'bold',
        textAlign:'center',
        width:'80%',
        alignSelf:'center',
    },
    searchbarcontainer:{
        width:'90%',
        alignSelf:'center',
    }
});

export default SearchTrailScreen;