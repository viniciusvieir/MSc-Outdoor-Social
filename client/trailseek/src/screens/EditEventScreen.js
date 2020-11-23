import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { putEvents } from "../app/eventSlice";
import EventForms from "../components/EventForm";

const EditEventScreen = () => {
  const { eventData, trailName } = useSelector(
    (state) => state.event.currentEvent[0]
  );
  const dispatch = useDispatch();
  const onSubmitFunc = async (values) => {
    const response = await dispatch(
      putEvents({
        inputs: values,
        trailID: eventData.trailId,
        eventID: eventData._id,
      })
    );
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
