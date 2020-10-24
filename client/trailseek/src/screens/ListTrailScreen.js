import React,{useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import trailSeek from '../api/trailSeek'
import {Intersect} from '../util/Intersect'

const ListTrailScreen = (getParams) => {
    const { query } = getParams;
    const [data, setData] = useState([]);

    const navigation = useNavigation();

    useEffect(()=>{
        async function fetchIDs(){
            try{
                const response = await trailSeek.get('/trails',{
                params:{
                    fields:"_id",
                    skip:10,
                    limit:100,
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
    },[])

    const trails = useSelector(state=>Intersect(state.trails.trails,data))
    return(
        <ScrollView>
            {
                trails.map((l, item) => (
                <ListItem key={item} bottomDivider onPress={()=>{navigation.push('ViewTrail',{id:l._id, name: l.name})}}>
                    <ListItem.Content>
                        <ListItem.Title>{l.name}</ListItem.Title>
                        <ListItem.Subtitle>{l.location}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                ))
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({});

export default ListTrailScreen;