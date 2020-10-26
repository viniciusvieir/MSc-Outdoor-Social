import React,{useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

// import trailSeek from '../api/trailSeek';
// import {Intersect} from '../util/Intersect';
import LoadSpinner from '../components/LoadSpinner';
import { fetchTrailsByQuery } from '../app/trailSlice';

const ListTrailScreen = ({route}) => {
    const { query } = route.params;
    let content
    const limit = 100000;
    let spinner = true;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const trailStatus = useSelector(state=> state.trails.status);
    const error = useSelector(state=>state.trails.error);

    useEffect(()=>{
        dispatch(fetchTrailsByQuery({query,limit}))
    },[]);
    const filteredTrails = useSelector(state=>state.trails.filteredTrails);

    if (trailStatus === 'loading'){
        spinner = true
    } else if (trailStatus==='failed'){
        spinner = false
        Toast.show(error,Toast.LONG);
        content=<Text>{error}</Text>
    } else if (trailStatus==='succeeded'){
        spinner = false
        content=filteredTrails.length>0?
            filteredTrails.map((l, item) => (
                    <ListItem key={item} bottomDivider onPress={()=>{navigation.navigate('ViewTrail',{id:l._id, name: l.name})}}>
                        <ListItem.Content>
                            <ListItem.Title>{l.name}</ListItem.Title>
                            <ListItem.Subtitle>{l.location}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    ))     
            :<Text>No Results</Text>  
    }  
    // data.length===0?spinner=true:spinner=false
    return( 
        <ScrollView>
            <LoadSpinner visible = {spinner}/>
            {content}
        </ScrollView>
    );
};

const styles = StyleSheet.create({});

export default ListTrailScreen;