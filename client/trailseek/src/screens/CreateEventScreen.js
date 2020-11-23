import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import { postEvents } from "../app/eventSlice";
import EventForms from "../components/EventForm";

const CreateEventScreen = ({ route, navigation }) => {
  const { trailName, trailID } = route.params;
  const dispatch = useDispatch();
  const onSubmitFunc = async (values) => {
    const response = await dispatch(postEvents({ inputs: values, trailID }));
  };

  return <EventForms trailName={trailName} onSubmitFunc={onSubmitFunc} />;
};
const styles = StyleSheet.create({});

export default CreateEventScreen;
