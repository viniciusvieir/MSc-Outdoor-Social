import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ListItem } from 'react-native-elements';

const ListTrailScreen = ({ navigation }) => {
    const list = [
        {
          name: 'Trail0',
          subtitle: 'Location'
        },
        {
          name: 'Trail1',
          subtitle: 'Location'
        },
      ];
    return(
        <>
            <Text h3>ListTrailScreen</Text>
            {
                list.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={()=>{navigation.navigate('ViewTrail')}}>
                    <ListItem.Content>
                    <ListItem.Title>{l.name}</ListItem.Title>
                    <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                ))
            }
        </>
    );
};

const styles = StyleSheet.create({});

export default ListTrailScreen;