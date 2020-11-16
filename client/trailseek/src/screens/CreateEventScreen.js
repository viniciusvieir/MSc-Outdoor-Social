import React, { createElement, useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Alert } from "react-native";
import { Text, Button, Container, Content } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { Text, Button } from "react-native-elements";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

import { postEvents } from "../app/eventSlice";
import ToastAlert from "../components/ToastAlert";
import ColorConstants from "../util/ColorConstants";
import { TouchableOpacity } from "react-native-gesture-handler";

const CreateEventScreen = ({ route, navigation }) => {
  const { trailName, trailID, refreshEvents } = route.params;
  const username = useSelector((state) => state.user.profile.name);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  return (
    <Container>
      <Content style={{ backgroundColor: ColorConstants.LGreen }}>
        <View style={{ backgroundColor: "#ffffff" + 30, flex: 1, padding: 10 }}>
          <Text h5 style={{ color: ColorConstants.DWhite, fontSize: 20 }}>
            Trail : {trailName}
          </Text>
          <Text h5 style={{ color: ColorConstants.DWhite }}>
            Organised by : {username}
          </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Formik
            initialValues={{
              title: "",
              description: "",
              date: moment().format("YYYY-MM-DD"),
              duration_min: "",
              max_participants: "",
            }}
            validationSchema={Yup.object({
              title: Yup.string().required("Required"),
              description: Yup.string().required("Required"),
              date: Yup.date().required("Required"),
              duration_min: Yup.number(),
              max_participants: Yup.number().lessThan(
                20,
                "Please select less than 20 Participants"
              ),
            })}
            onSubmit={async (values, formikActions) => {
              try {
                const response = await dispatch(
                  postEvents({ inputs: values, trailID })
                );
                formikActions.setSubmitting(false);
                // refreshEvents();
                navigation.goBack();
              } catch (e) {
                ToastAlert(e.message);
              }
              // setTimeout(() => {
              //   Alert.alert(JSON.stringify(values));
              //   // Important: Make sure to setSubmitting to false so our loading indicator
              //   // goes away.
              // }, 500);
            }}
          >
            {(props) => (
              <View>
                <TextInput
                  onChangeText={props.handleChange("title")}
                  onBlur={props.handleBlur("title")}
                  value={props.values.title}
                  autoFocus
                  placeholder="Event Title"
                  style={styles.input}
                  placeholderTextColor={ColorConstants.Black}
                  onSubmitEditing={() => {
                    // on certain forms, it is nice to move the user's focus
                    // to the next input when they press enter.
                    // this.emailInput.focus();
                  }}
                />
                {props.touched.title && props.errors.title ? (
                  <Text style={styles.error}>{props.errors.title}</Text>
                ) : null}
                {/* <View style={{ alignContent: "flex-start" }}> */}
                <TextInput
                  onChangeText={props.handleChange("description")}
                  onBlur={props.handleBlur("description")}
                  value={props.values.description}
                  placeholder="Event Description"
                  style={styles.multiInput}
                  multiline
                  numberOfLines={5}
                  placeholderTextColor={ColorConstants.Black}

                  // ref={(el) => (this.emailInput = el)}
                />
                {props.touched.description && props.errors.description ? (
                  <Text style={styles.error}>{props.errors.description}</Text>
                ) : null}
                {/* </View> */}
                <View
                  style={{
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: ColorConstants.DWhite }}>
                    Event Date :{" "}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setShow(true);
                    }}
                    style={{
                      backgroundColor: ColorConstants.DWhite,
                      padding: 5,
                      marginVertical: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text>
                      {moment(props.values.date).format("YYYY-MM-DD")}
                    </Text>
                  </TouchableOpacity>

                  {show && (
                    <DateTimePicker
                      display="default"
                      mode="date"
                      onChange={(event, selectedDate) => {
                        setShow(Platform.OS === "ios");
                        props.setFieldValue(
                          "date",
                          moment(selectedDate).format("YYYY-MM-DD")
                        );
                      }}
                      // onCancel={hideDatePicker}
                      minimumDate={moment().toDate()}
                      value={moment(props.values.date).toDate()}
                    />
                  )}
                </View>
                {props.touched.date && props.errors.date ? (
                  <Text style={styles.error}>{props.errors.date}</Text>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    onChangeText={props.handleChange("duration_min")}
                    onBlur={props.handleBlur("duration_min")}
                    value={props.values.name}
                    autoFocus
                    placeholder="Event Duration in minutes"
                    style={styles.input}
                    onSubmitEditing={() => {}}
                    keyboardType="number-pad"
                    placeholderTextColor={ColorConstants.Black}
                  />
                  {props.touched.duration_min && props.errors.duration_min ? (
                    <Text style={styles.error}>
                      {props.errors.duration_min}
                    </Text>
                  ) : null}
                  <TextInput
                    onChangeText={props.handleChange("max_participants")}
                    onBlur={props.handleBlur("max_participants")}
                    value={props.values.name}
                    autoFocus
                    placeholder="Maximum Participants"
                    style={styles.input}
                    onSubmitEditing={() => {}}
                    keyboardType="number-pad"
                    placeholderTextColor={ColorConstants.Black}
                  />
                  {props.touched.max_participants &&
                  props.errors.max_participants ? (
                    <Text style={styles.error}>
                      {props.errors.max_participants}
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    onPress={props.handleSubmit}
                    disabled={props.isSubmitting}
                    style={{
                      marginTop: 16,
                      backgroundColor: ColorConstants.Yellow,
                    }}
                  >
                    <Text>Submit</Text>
                  </Button>
                  <Button
                    onPress={props.handleReset}
                    disabled={props.isSubmitting}
                    style={{
                      marginTop: 16,
                      backgroundColor: ColorConstants.Yellow,
                    }}
                  >
                    <Text>Reset</Text>
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  input: {
    borderColor: ColorConstants.DWhite,
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.DWhite,
  },
  error: {
    color: "red",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  multiInput: {
    borderColor: ColorConstants.DWhite,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 20,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.DWhite,
  },
});

export default CreateEventScreen;
