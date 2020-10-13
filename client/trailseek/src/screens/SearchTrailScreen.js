import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, SearchBar, Card } from 'react-native-elements';

const SearchTrailScreen = ({ navigation}) => {
    return(
        <>
            <Text h3>SearchTrailScreen</Text>
            <SearchBar />
            <ScrollView horizontal style={{maxHeight:200}}>
                <Card containerStyle={{width:300}}>
                    <Card.Title>HELLO WORLD</Card.Title>
                    <Card.Divider/>
                    {/* <Card.Image source={require('../images/pic2.jpg')} /> */}
                    <Text style={{marginBottom: 10}}>
                        The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        onPress={()=>navigation.navigate('ViewTrail')}
                        // icon={<Icon name='code' color='#ffffff' />}
                        // buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW' />
                </Card>
                <Card containerStyle={{width:300}}>
                    <Card.Title>HELLO WORLD</Card.Title>
                    <Card.Divider/>
                    {/* <Card.Image source={require('../images/pic2.jpg')} /> */}
                    <Text style={{marginBottom: 10}}>
                        The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        // icon={<Icon name='code' color='#ffffff' />}
                        // buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW' />
                </Card>
                <Card containerStyle={{width:300}}>
                    <Card.Title>HELLO WORLD</Card.Title>
                    <Card.Divider/>
                    {/* <Card.Image source={require('../images/pic2.jpg')} /> */}
                    <Text style={{marginBottom: 10}}>
                        The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        // icon={<Icon name='code' color='#ffffff' />}
                        // buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='VIEW NOW' />
                </Card>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({});

export default SearchTrailScreen;