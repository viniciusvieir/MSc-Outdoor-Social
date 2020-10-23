import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SearchBar } from 'react-native-elements';

import TrailCard from '../components/TrailCards';


const SearchTrailScreen = () => {
    
    const reqFields = 'name,avg_rating,location,img_url'

    const easyParams = {
        title:'Easy Trails',
        fields:reqFields,
        query:{"difficulty":"Easy"}
    }

    return(
        <View style={{marginTop:30}}>
            <Text h3 style={{marginLeft:5}}>Hi! User</Text>
            <SearchBar 
                lightTheme={true}
            />
            <TrailCard getParams={easyParams}/>
        </View>
    );
};

const styles = StyleSheet.create({});

export default SearchTrailScreen;