import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Upload from "../components/Upload";

function Untitled(props) {
  return (
    <View style={styles.container}>
      <View style={styles.uploadStackColumn}>
        <View style={styles.uploadStack}>
          <Upload style={styles.upload}></Upload>
          <TouchableOpacity style={styles.button7}>
            <Text style={styles.uploadPicture}>Upload Picture</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button5}>
          <Text style={styles.password}>Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button4}>
          <Text style={styles.email}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Untitled")}
          style={styles.button3}
        >
          <Text style={styles.gender}>Gender</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.dob}>DOB</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button6}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button8}>
          <Text style={styles.areaOfInterest}>Area of Interest</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button}>
        <View style={styles.nameFiller}></View>
        <Text style={styles.name}>Name</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  upload: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 199,
    width: 199
  },
  button7: {
    top: 60,
    width: 114,
    height: 51,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    left: 43
  },
  uploadPicture: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    opacity: 0.5,
    marginTop: 21,
    marginLeft: 9
  },
  uploadStack: {
    width: 199,
    height: 199,
    marginLeft: 50
  },
  button5: {
    width: 300,
    height: 41,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: 262
  },
  password: {
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 14,
    fontSize: 16,
    opacity: 0.51,
    marginTop: 14,
    marginLeft: 7
  },
  button4: {
    width: 300,
    height: 41,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: -101
  },
  email: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    opacity: 0.51,
    marginTop: 13,
    marginLeft: 7
  },
  button3: {
    width: 300,
    height: 41,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: -101
  },
  gender: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    fontSize: 16,
    opacity: 0.5,
    marginTop: 9,
    marginLeft: 7
  },
  button2: {
    width: 300,
    height: 41,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: -101
  },
  dob: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    opacity: 0.5,
    fontSize: 16,
    marginTop: 13,
    marginLeft: 7
  },
  button6: {
    width: 300,
    height: 41,
    backgroundColor: "rgba(74,144,226,1)",
    marginTop: 259
  },
  save: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 130,
    alignSelf: "center"
  },
  button8: {
    width: 300,
    height: 41,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: -101
  },
  areaOfInterest: {
    fontFamily: "roboto-regular",
    color: "#121212",
    opacity: 0.51,
    fontSize: 16,
    marginTop: 12,
    marginLeft: 7
  },
  uploadStackColumn: {
    width: 300,
    marginTop: 79,
    marginLeft: 38
  },
  button: {
    width: 300,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,1)",
    flex: 1,
    marginBottom: 473,
    marginTop: -402,
    marginLeft: 38
  },
  nameFiller: {
    flex: 1
  },
  name: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    fontSize: 16,
    opacity: 0.5,
    marginBottom: 12,
    marginLeft: 7
  }
});

export default Untitled;
