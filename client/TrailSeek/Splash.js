import React, {component} From 'react';
import {View,ImageBackground,Image} from 'react-native';


var bg-require ('./background.png');
var logo-require('./logo.png');

export default class Splash extends component
{
    constructor(props)
    {
        super(props);
        setTimeout(() => {
            this.props.navigation.navigate("Login");
        },5000); 
    }
    render()
    {
        return(
                <ImageBackground
                source={bg}
                style={{height:'100%,width:'100%}}>
                <view
                style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <image source={logo}
                    style={{height:100,width:100}}></image>
                </view>
                </ImageBackground> 

        );
        }
}
