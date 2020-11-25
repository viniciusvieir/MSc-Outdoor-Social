import "react-native";

import SigninScreen from "../src/screens/SigninScreen";
import renderer from "react-test-renderer";
import React from "react";
test("SigninScreen SnapShot", ()=>{
    
    const snap = renderer.create(
        <SigninScreen />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});