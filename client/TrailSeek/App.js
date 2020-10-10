import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{createStackNavigator,createAppContainer} from 'react-navigation';
import Splash from './Splash';   
import Login from './Login';
const App=createStackNavigator{{
  Splash:{screen:Splash,navigationOptions:{header:null}},
  Login:{screen:Login,nativgationOptions:{header:null}}
}};

export default createAppContainer(App);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>TrailSeek</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
