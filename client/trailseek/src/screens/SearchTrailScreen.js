import React,{ useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, SearchBar } from 'react-native-elements';

import { fetchTrails, selectAllTrails } from '../app/trailSlice';
import TrailCard from '../components/TrailCards';


const SearchTrailScreen = ({ navigation}) => {
    const dispatch = useDispatch();
    const trails = useSelector(selectAllTrails);

    const trailStatus = useSelector(state=> state.trails.status);
    const error = useSelector(state=>state.trails.error);

    useEffect(()=>{
        if (trailStatus ==='idle'){
            dispatch(fetchTrails());
        }
    },[trailStatus,dispatch])

    let content;

    if (trailStatus === 'loading'){
        content = <ActivityIndicator />
    } else if (trailStatus==='failed'){
        content=<Text>{error}</Text>
    } else if (trailStatus==='succeeded'){
        content = <ScrollView horizontal style={{maxHeight:275}} navigation={navigation}>
                    <TrailCard title='All Trails' trailList={trails} />
                </ScrollView>
    }

    return(
        <View>
            <Text h3>SearchTrailScreen</Text>
            <SearchBar 
                lightTheme={true}
            />
            {content}
        </View>
    );
};

const styles = StyleSheet.create({});

export default SearchTrailScreen;