import "react-native";

import ViewTrailScreen from "../src/screens/ViewTrailScreen";
import renderer from "react-test-renderer";
import React from "react";
test("ViewTrailScreen SnapShot", ()=>{
    
    const snap = renderer.create(
        <ViewTrailScreen />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});