import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "native-base";

import { putEvents } from "../app/eventSlice";
import EventForms from "../components/EventForm";
import ToastAlert from "../components/ToastAlert";

const EditEventScreen = ({ navigation }) => {
  const { eventData, trailName } = useSelector(
    (state) => state.event.currentEvent[0]
  );
  const dispatch = useDispatch();
  const onSubmitFunc = async (values) => {
    try {
      const response = await dispatch(
        putEvents({
          inputs: values,
          trailID: eventData.trailId,
          eventID: eventData._id,
        })
      );
      unwrapResult(response);
      Toast.show({
        text: "Event edited",
        type: "success",
        buttonText: "Ok",
        duration: 2000,
      });
      navigation.goBack();
    } catch (e) {
      ToastAlert(e.message);
    }
  };

  return (
    <EventForms
      trailName={trailName}
      eventData={eventData}
      onSubmitFunc={onSubmitFunc}
    />
  );
};
const styles = StyleSheet.create({});

export default EditEventScreen;
