import "react-native";

import SignupScreen from "../src/screens/SignupScreen";
import renderer from "react-test-renderer";
import React from "react";
test("SignupScreen SnapShot", ()=>{
    
    const snap = renderer.create(
        <SignupScreen />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});