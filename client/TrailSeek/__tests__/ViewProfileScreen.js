import "react-native";

import ViewProfileScreen from "../src/screens/ViewProfileScreen";
import renderer from "react-test-renderer";
import React from "react";
test("ViewProfileScreen SnapShot", ()=>{
    
    const snap = renderer.create(
        <ViewProfileScreen />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});