import React, { useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Text,
  Button,
  Container,
  Content,
  Left,
  Right,
  Body,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useSelector } from "react-redux";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { FontAwesome5 } from "@expo/vector-icons";

import ToastAlert from "../components/ToastAlert";
import ColorConstants from "../util/ColorConstants";

const EventForm = ({ trailName, eventData, onSubmitFunc }) => {
  const username = useSelector((state) => state.user.profile.name);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  //   const dispatch = useDispatch();

  return (
    <Container>
      <Content style={{ backgroundColor: ColorConstants.DWhite }}>
        <View style={{ backgroundColor: "#ffffff" + 30, flex: 1, padding: 10 }}>
          <Text
            style={{
              color: ColorConstants.primary,
              fontSize: 26,
              fontWeight: "bold",
            }}
          >
            Outing on {trailName}
          </Text>
          <Text style={{ fontSize: 16 }}>Organized by : {username}</Text>
        </View>
        <View style={{ margin: 10 }}>
          <Formik
            initialValues={
              eventData
                ? eventData
                : {
                    title: "",
                    description: "",
                    date: moment().format("YYYY-MM-DD"),
                    duration_min: "",
                    max_participants: "",
                  }
            }
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
                const res = await onSubmitFunc(values);
                // const response = await dispatch(
                //   postEvents({ inputs: values, trailID })
                // );
                formikActions.setSubmitting(false);
                navigation.goBack();
              } catch (e) {
                ToastAlert(e.message);
              }
            }}
          >
            {(props) => (
              <Grid>
                <Row>
                  <Text>Outing Title :</Text>
                </Row>
                <Row>
                  <TextInput
                    onChangeText={props.handleChange("title")}
                    onBlur={props.handleBlur("title")}
                    value={props.values.title}
                    autoFocus
                    // placeholder="Event Title"
                    style={styles.input}
                    placeholderTextColor={ColorConstants.Black}
                    onSubmitEditing={() => {
                      // on certain forms, it is nice to move the user's focus
                      // to the next input when they press enter.
                      // this.emailInput.focus();
                    }}
                  />
                </Row>
                <Row>
                  {props.touched.title && props.errors.title ? (
                    <Text style={styles.error}>{props.errors.title}</Text>
                  ) : null}
                </Row>
                <Row>
                  <Text style={{ color: ColorConstants.Black }}>
                    Outing Date :{" "}
                  </Text>
                </Row>
                <Row>
                  <TouchableOpacity
                    onPress={() => {
                      setShow(true);
                    }}
                    style={[styles.input, { flexDirection: "row" }]}
                  >
                    <Col style={{ justifyContent: "center" }}>
                      <Text>
                        {moment(props.values.date).format("YYYY-MM-DD")}
                      </Text>
                    </Col>
                    <Col
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-end",
                      }}
                    >
                      <FontAwesome5
                        name="calendar-alt"
                        size={24}
                        color={ColorConstants.darkGray}
                      />
                    </Col>
                  </TouchableOpacity>
                </Row>
                <Row>
                  {props.touched.date && props.errors.date ? (
                    <Text style={styles.error}>{props.errors.date}</Text>
                  ) : null}
                </Row>

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
                {/* </View> */}
                <Row>
                  <Text style={{ color: ColorConstants.Black }}>
                    Outing Description :
                  </Text>
                </Row>
                <Row>
                  <TextInput
                    onChangeText={props.handleChange("description")}
                    onBlur={props.handleBlur("description")}
                    value={props.values.description}
                    // placeholder="Event Description"
                    style={styles.multiInput}
                    multiline
                    numberOfLines={5}
                    placeholderTextColor={ColorConstants.Black}

                    // ref={(el) => (this.emailInput = el)}
                  />
                </Row>
                <Row>
                  {props.touched.description && props.errors.description ? (
                    <Text style={styles.error}>{props.errors.description}</Text>
                  ) : null}
                </Row>
                <Row>
                  <Text style={{ color: ColorConstants.Black }}>
                    Event Duration in minutes :
                  </Text>
                </Row>
                <Row>
                  <TextInput
                    onChangeText={props.handleChange("duration_min")}
                    onBlur={props.handleBlur("duration_min")}
                    value={props.values.duration_min}
                    style={styles.input}
                    onSubmitEditing={() => {}}
                    keyboardType="number-pad"
                    placeholderTextColor={ColorConstants.Black}
                  />
                </Row>
                <Row>
                  {props.touched.duration_min && props.errors.duration_min ? (
                    <Text style={styles.error}>
                      {props.errors.duration_min}
                    </Text>
                  ) : null}
                </Row>
                <Row>
                  <Text style={{ color: ColorConstants.Black }}>
                    Maximum Participants :
                  </Text>
                </Row>
                <Row>
                  <TextInput
                    onChangeText={props.handleChange("max_participants")}
                    onBlur={props.handleBlur("max_participants")}
                    value={props.values.max_participants}
                    style={styles.input}
                    onSubmitEditing={() => {}}
                    keyboardType="number-pad"
                    placeholderTextColor={ColorConstants.Black}
                  />
                </Row>
                <Row>
                  {props.touched.max_participants &&
                  props.errors.max_participants ? (
                    <Text style={styles.error}>
                      {props.errors.max_participants}
                    </Text>
                  ) : null}
                </Row>
                <Button
                  onPress={props.handleSubmit}
                  disabled={props.isSubmitting}
                  block
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
                  danger
                  block
                  style={{
                    marginTop: 16,
                  }}
                >
                  <Text>Reset</Text>
                </Button>
              </Grid>
            )}
          </Formik>
        </View>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  input: {
    borderColor: ColorConstants.darkGray + 60,
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
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
    borderColor: ColorConstants.darkGray + 60,
    borderWidth: 1,
    borderRadius: 5,
    minHeight: 20,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.DWhite,
    flex: 1,
  },
});

export default EventForm;
