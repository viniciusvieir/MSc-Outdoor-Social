import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Linking, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppLoading } from "expo";
import { Root } from "native-base";
import * as Font from "expo-font";

import ColorConstants from "./src/util/ColorConstants";
import { getToken } from "./src/app/userSlice";
import CreateEventScreen from "./src/screens/CreateEventScreen";
import ViewEventScreen from "./src/screens/ViewEventScreen";
import ViewTrailScreen from "./src/screens/ViewTrailScreen";
import EditEventScreen from "./src/screens/EditEventScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import ListEventScreen from "./src/screens/ListEventScreen";
import ListTrailScreen from "./src/screens/ListTrailScreen";
import MyEventScreen from "./src/screens/MyEventScreen";
import SearchTrailScreen from "./src/screens/SearchTrailScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ViewProfileScreen from "./src/screens/ViewProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// import { LogBox } from "react-native"; //Remove after demo
// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message//Remove after demo
// LogBox.ignoreAllLogs(); //Remove after demo

const AuthenticationFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ headerTransparent: true, title: "" }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerTransparent: true, title: "" }}
      />
    </Stack.Navigator>
  );
};

const ProfileFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={{
          headerStyle: { backgroundColor: ColorConstants.Black },
          headerLeft: null,
          headerTitleStyle: { color: ColorConstants.DWhite },
          title: "My Profile",
          // headerTintColor: ColorConstants.Black,
        }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const TrailFlow = () => {
  const autFlag = useSelector((state) => state.user.isAuth);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchTrail"
        component={SearchTrailScreen}
        options={{
          headerLeft: null,
          title: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="ListTrail"
        component={ListTrailScreen}
        options={({ route }) => ({
          headerStyle: { backgroundColor: ColorConstants.Black },
          headerTitleStyle: { color: ColorConstants.DWhite },
          title:
            typeof route.params.getParams?.title === "undefined"
              ? "Search"
              : route.params.getParams.title,
        })}
      />
      <Stack.Screen
        name="ViewTrail"
        component={ViewTrailScreen}
        options={() => ({
          title: "",
          headerTransparent: true,
          headerBackImage: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="white"
              style={styles.shadow}
            />
          ),
          // headerTitleStyle: {
          //     fontWeight: '600',
          //     color:'white',
          //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
          //     textShadowOffset: {width: -1, height: 1},
          //     textShadowRadius: 10
          //   },
        })}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          headerStyle: { backgroundColor: ColorConstants.Black },
          headerTitleStyle: { color: ColorConstants.DWhite },
          title: "Create Event",
          headerBackImage: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="white"
              style={styles.shadow}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: (e) => {
            autFlag ? null : navigation.navigate("Signin");
          },
        })}
      />
      <Stack.Screen name="ListEvent" component={ListEventScreen} />
    </Stack.Navigator>
  );
};

const EventFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyEvent"
        component={MyEventScreen}
        options={{
          headerStyle: { backgroundColor: ColorConstants.Black },
          headerLeft: null,
          headerTitleStyle: { color: ColorConstants.DWhite },
          title: "My Events",
          // headerTintColor: ColorConstants.Black,
        }}
      />
    </Stack.Navigator>
  );
};

const MainTabFlow = () => {
  const autFlag = useSelector((state) => state.user.isAuth);
  return (
    <Tab.Navigator
      initialRouteName="TrailFlow"
      tabBarOptions={{
        activeTintColor: ColorConstants.Yellow,
        inactiveTintColor: ColorConstants.White,
        inactiveBackgroundColor: ColorConstants.Black,
        activeBackgroundColor: ColorConstants.Black,
        tabStyle: {
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="TrailFlow"
        component={TrailFlow}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EventFlow"
        component={EventFlow}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            autFlag ? null : navigation.navigate("Signin");
          },
        })}
        options={{
          tabBarLabel: "Events",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileFlow"
        component={ProfileFlow}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            autFlag ? null : navigation.navigate("Signin");
          },
        })}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={24} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditProfile", { id: route.params.id });
              }}
            >
              <Ionicons
                name="md-create"
                size={30}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// const prefix = Linking.makeUrl("/");
// const linking = {
//   prefixes: [prefix],
//   config: {
//     screens: {
//       Authentication: {
//         path: "stack",
//         initialRouteName: "Home",
//         screens: {
//           Home: "home",
//           Profile: {
//             path: "user/:id/:age",
//             parse: {
//               id: id => `there, ${id}`,
//               age: Number,
//             },
//             stringify: {
//               id: id => id.replace("there, ", ""),
//             },
//           },
//         },
//       },
//       MainTab: "settings",
//     },
//   },
// };

const AppNav = () => {
  const dispatch = useDispatch();
  const [initRoutName, setInitRoutName] = useState(null);
  const autFlag = useSelector((state) => state.user.isAuth);
  const [isLoading, setIsLoading] = useState(true);

  const getAsyncToken = async () => {
    try {
      await Font.loadAsync({
        Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
      });
      const results = await dispatch(getToken());
      return results;
    } catch (e) {
      console.log(e.message);
    }
  };
  if (isLoading) {
    return (
      <AppLoading
        startAsync={getAsyncToken}
        onFinish={() => {
          autFlag
            ? setInitRoutName("MainTab")
            : setInitRoutName("Authentication");
          setIsLoading(false);
        }}
        onError={console.warn}
      />
    );
  }
  return (
    <Root>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initRoutName}>
          <Stack.Screen
            name="Authentication"
            component={AuthenticationFlow}
            options={{ headerTransparent: true, title: "" }}
          />
          <Stack.Screen
            name="MainTab"
            component={MainTabFlow}
            options={{
              headerShown: false,
              headerRight: null,
            }}
          />
          <Stack.Screen
            name="ViewEvent"
            component={ViewEventScreen}
            options={({ navigation }) => ({
              title: "",
              headerTransparent: true,
              headerBackImage: () => (
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color="#000000"
                  style={styles.shadow}
                />
              ),
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditEvent");
                  }}
                >
                  <MaterialIcons
                    name="edit"
                    size={24}
                    style={{ color: "#000000", marginRight: 20 }}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
            options={{
              headerStyle: { backgroundColor: ColorConstants.Black },
              headerTitleStyle: { color: ColorConstants.DWhite },
              title: "Edit Events",
              // headerTintColor: ColorConstants.Black,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOffset: {
      height: 1, // i.e. the shadow has to be offset in some way
    },
  },
});

export default AppNav;
