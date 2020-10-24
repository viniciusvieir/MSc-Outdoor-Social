import React,{ useState,useEffect } from 'react';
import { View, StyleSheet,ScrollView, ActivityIndicator } from 'react-native';
import { Text, SearchBar } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrails } from '../app/trailSlice'
import * as Location from 'expo-location';

import TrailCard from '../components/TrailCards';

const SearchTrailScreen = () => {
    const dispatch = useDispatch();

    const trailStatus = useSelector(state=> state.trails.status);
    const error = useSelector(state=>state.trails.error);

    //Initial Trail Fetch
    useEffect(()=>{
        if (trailStatus ==='idle'){
            const fields='name,avg_rating,location,img_url';
            const limit = 100000
            dispatch(fetchTrails({fields,limit}));
        }
    },[trailStatus,dispatch])
    
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    //Location
    useEffect(() => {
        (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        })();
    }, []);

    let loc = false;
    if (location) {
        loc = location.coords.latitude
    }

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

    let content;

    if (trailStatus === 'loading'){
        content = <ActivityIndicator />
    } else if (trailStatus==='failed'){
        content=<Text>{errorMsg}</Text>
    } else if (trailStatus==='succeeded'){
        content=<ScrollView>
                    <TrailCard getParams={easyParams}/>
                    <TrailCard getParams={bestParams}/>
                </ScrollView>
    }

    return(
        <View style={{marginTop:30}}>
            <Text h3 style={{marginLeft:5}}>Hi! User</Text>
            <SearchBar 
                style={styles.searchbar}
                lightTheme={true}
                
            />
            {content}
            </View>
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
    },
    


});

export default SearchTrailScreen;