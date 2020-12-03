import "react-native";

import EditProfileScreen from "../src/screens/EditProfileScreen";
import renderer from "react-test-renderer";
import React from "react";
test("EditProfileScreen SnapShot", ()=>{
    
    const snap = renderer.create(
        <EditProfileScreen />
    ).toJSON();
    expect(snap).toMatchSnapshot();
});