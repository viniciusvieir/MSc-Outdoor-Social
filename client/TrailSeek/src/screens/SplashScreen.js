import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";

function SplashScreen(props) {
    
    setInterval(function(){
        props.navigation.navigate('Authentication');
    }, 2000)

    return (
        <View style={styles.container}>
            <Image
                source={require("../images/tslogo.png")}
                resizeMode="contain"
                style={styles.image}
            ></Image>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      image: {
        width: 200,
        height: 200,
        alignSelf:'center'
      }
});

export default SplashScreen;
