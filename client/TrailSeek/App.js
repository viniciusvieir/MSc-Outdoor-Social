import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';

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
          headerLeft:null
        }}
      />
      <Stack.Screen name='ListTrail' component={ListTrailScreen} />
      <Stack.Screen name='ViewTrail' component={ViewTrailScreen} />
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
    <Tab.Navigator>
      <Tab.Screen name='TrailFlow' component={TrailFlow} />
      <Tab.Screen name='EventFlow' component={EventFlow} />
      <Tab.Screen name='ProfileFlow' component={ProfileFlow} />
    </Tab.Navigator>
  );
};

const App = () => {
  return(
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Authentication' component={AuthenticationFlow} />
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

export default App;