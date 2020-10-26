import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { TouchableOpacity, StyleSheet } from 'react-native';

import CreateEventScreen from './src/screens/CreateEventScreen';
import ViewEventScreen from './src/screens/ViewEventScreen';
import ViewTrailScreen from './src/screens/ViewTrailScreen';
import EditEventScreen from './src/screens/EditEventScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ListEventScreen from './src/screens/ListEventScreen';
import ListTrailScreen from './src/screens/ListTrailScreen';
import MyEventScreen from './src/screens/MyEventScreen';
import SearchTrailScreen from './src/screens/SearchTrailScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import SplashScreen from './src/screens/SplashScreen';
import ViewProfileScreen from './src/screens/ViewProfileScreen';

import store from './src/app/store';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

if(global.loggedin == undefined || global.loggedin == null){
  global.loggedin = null
}

const SplashFlow = ()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen name='Splash' component={SplashScreen} />
  
    </Stack.Navigator>
  );
};

const AuthenticationFlow = ()=>{
  return(
    <Stack.Navigator>
      
      <Stack.Screen name='Signin' component={SigninScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  );
};

const ProfileFlow = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name='ViewProfile' component={ViewProfileScreen} options={{headerLeft:null}}/>
      <Stack.Screen name='EditProfile' component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const TrailFlow = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen 
        name='SearchTrail' 
        component={SearchTrailScreen} 
        options={{
          headerLeft:null,
          title:'',
          headerTransparent:true
        }}
      />
      <Stack.Screen 
        name='ListTrail' 
        component={ListTrailScreen} 
        options={({ route }) => ({
          title:(typeof(route.params.getParams?.title)==='undefined')?"Search":route.params.getParams.title
        })}
      />
      <Stack.Screen 
        name='ViewTrail' 
        component={ViewTrailScreen} 
        options={({ route,navigation }) => ({
          title:'',
          headerTransparent:true,
          headerBackImage:()=>(<MaterialIcons 
                                  name="arrow-back" 
                                  size={24} 
                                  color="white" 
                                  style={styles.shadow} />),
          // headerTitleStyle: {
          //     fontWeight: '600',
          //     color:'white',
          //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
          //     textShadowOffset: {width: -1, height: 1},
          //     textShadowRadius: 10
          //   },
          })}
      />
      <Stack.Screen name='CreateEvent' component={CreateEventScreen} />
      <Stack.Screen name='ListEvent' component={ListEventScreen} />
    </Stack.Navigator>
  );

};

const EventFlow = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen 
        name='MyEvent' 
        component={MyEventScreen} 
        options={{
          headerLeft:null
        }}
      />
      <Stack.Screen name='ViewEvent' component={ViewEventScreen}/>
      <Stack.Screen name='EditEvent' component={EditEventScreen} />
    </Stack.Navigator>
  );
};

const MainTabFlow = () =>{
  return(
    <Tab.Navigator
      // initialRouteName="TrailFlow"
      tabBarOptions={{
        activeTintColor: '#e91e63',
        tabStyle:{
          paddingTop: 8}
      }}
    >
      <Tab.Screen 
        name='TrailFlow' 
        component={TrailFlow} 
        options={{
          tabBarLabel: 'Explore',
          tabBarButton: props => <TouchableOpacity {...props} /> ,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name='EventFlow' 
        component={EventFlow}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
        
      />
      <Tab.Screen 
        name='ProfileFlow' 
        component={ProfileFlow} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return(
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Authentication' component={AuthenticationFlow} />
          <Stack.Screen name='TrailFlow' component={TrailFlow} />
          <Stack.Screen name=' ' component={SplashFlow} />
          <Stack.Screen 
            name='MainTab' 
            component={MainTabFlow} 
            options={{
              headerShown:false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  shadow: {
      shadowColor: 'black',
      shadowOffset: {
          height: 1,           // i.e. the shadow has to be offset in some way
      }},
    });


export default App;