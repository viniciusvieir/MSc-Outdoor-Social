import "react-native";

import ListTrailScreen from "../src/screens/ListTrailScreen";
import renderer from "react-test-renderer";
import React from "react";
test("ListTrailScreen SnapShot", ()=>{
    
    const snap = renderer.create(
        <ListTrailScreen />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});