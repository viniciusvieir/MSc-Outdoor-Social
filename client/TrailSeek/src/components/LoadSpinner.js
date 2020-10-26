import React from "react";
import { StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const LoadSpinner = ({ visible }) => {
  return (
    <Spinner
      visible={visible}
      textContent={"Loading"}
      textStyle={styles.spinnerTextStyle}
    />
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
    width: 80,
  },
});

export default LoadSpinner;
