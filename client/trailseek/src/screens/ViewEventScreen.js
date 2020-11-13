// import React, { createElement, useEffect, useState } from "react";
// import { TextInput, View, StyleSheet, Image, Keyboard } from "react-native";
// import { Text, Button } from "react-native-elements";
// import { useSelector, useDispatch } from "react-redux";
// import { signIn } from "../app/userSlice";
// import { useForm, Controller } from "react-hook-form";

// const ViewEventScreen = ({ navigation }) => {
//     return(
//         <>
//             <Text h3>ViewEventScreen</Text>
//             <Button title='Edit Event' onPress={()=>{navigation.navigate('EditEvent')}} />
//         </>
//     );
// };

// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Text, Button } from 'react-native-elements';

// const EditEventScreen = () => {
//     return(
//         <>
//             <Text h3>EditEventScreen</Text>
//         </>
//     );
// };

// const styles = StyleSheet.create({});

// export default EditEventScreen;
import React, { createElement, useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Image, Keyboard } from "react-native";
// import { Text, Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../app/userSlice";
import { useForm, Controller } from "react-hook-form";

import StarRating from "react-native-star-rating";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Button, Text, H1, Card, CardItem } from "native-base";
import ColorConstants from "../util/ColorConstants";

const ViewEventScreen = ({ route, navigation }) => {
  const [inputs, setInput] = useState({});
  const isAuth = useSelector((state) => state.user.isAuth);
  const { trailName, trailID } = route.params;
  const error = useSelector((state) => state.user.error);
  const username = useSelector((state) => state.user.profile.name);
  const userStatus = useSelector((state) => state.user.status);

  const onSubmit = (data) => {console.log(data);};
  const { register, control, handleSubmit, errors } = useForm();
  const inputsHandler = (e, field) => {
    setInputs((inputs) => ({ ...inputs, [field]: e }));
  };

  return (
    <>
      <Text h3>View Event</Text>

      <View style={styles.maincontainer}>
        {/* map here */}

        <View style={styles.mapcontainer}></View>

        <View style={styles.infocontainer}>
          {
            <Text h5 style={styles.desc}>
              Trail: {trailName}
            </Text>
          }
          {
            <Text h5 style={styles.desc}>
              Organizer: {username}
            </Text>
          }
        </View>
        <View style={styles.formcontainer}>
          <Text h4>Create Event</Text>

          {/* event name */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder={"Event Name"}
              />
            )}
            name="eventname"
            rules={{ required: true, minLength: 4, maxLength: 15 }}
            defaultValue=""
          />
          {errors.eventname && errors.eventname.type === "required" && (
            <Text style={styles.errstl}>Event name is required.</Text>
          )}
          {errors.eventname && errors.eventname.type === "minLength" && (
            <Text style={styles.errstl}>Min length 4 characters.</Text>
          )}
          {errors.eventname && errors.eventname.type === "maxLength" && (
            <Text style={styles.errstl}>Max length 15 characters.</Text>
          )}

          {/* event date */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder={"Event Date"}
              />
            )}
            name="eventdate"
            rules={{ required: true, minLength: 4, maxLength: 15 }}
            defaultValue=""
          />
          {errors.eventdate && errors.eventdate.type === "required" && (
            <Text style={styles.errstl}>Event date is required.</Text>
          )}

          {/* event description */}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder={"Event Description"}
              />
            )}
            name="eventdescription"
            rules={{ required: true, minLength: 4, maxLength: 15 }}
            defaultValue=""
          />
          {errors.eventdescription &&
            errors.eventdescription.type === "required" && (
              <Text style={styles.errstl}>Description is required.</Text>
            )}
          {errors.eventdescription &&
            errors.eventdescription.type === "minLength" && (
              <Text style={styles.errstl}>Min length 10 characters.</Text>
            )}
          {errors.eventdescription &&
            errors.eventdescription.type === "maxLength" && (
              <Text style={styles.errstl}>Max length 50 characters.</Text>
            )}

          {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
          
          <Card>
            <Button
              block
              style={{
                margin: 5,
                backgroundColor: ColorConstants.DGreen,
              }}
              onPress={() => {}}
            >
            <Text style={{ fontSize: 16, color: "white" }}>
              View Events
            </Text>
            </Button>
          </Card>
        </View>
      </View>
    </>
  );
};
// 979aad
const styles = StyleSheet.create({
  desc: {
    color: "#979aad",
  },

  mapcontainer: {
    backgroundColor: "#ffffff",
    margin: 5,
    padding: 5,
    borderRadius: 5,
    
  },
  maincontainer: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  infocontainer: {
    backgroundColor: "#ffffff",
    margin: 5,
    padding: 5,
    borderRadius: 5,
  },

  input: {
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },

  errstl: {
    color: "red",
    marginBottom: 10,
  },
  formcontainer: {
    backgroundColor: "#ffffff",
    margin: 5,
    padding: 5,
    borderRadius: 5,
  },

});

export default ViewEventScreen;
