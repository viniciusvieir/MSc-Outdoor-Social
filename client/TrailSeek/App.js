import React, { useEffect } from "react";
import { Provider } from "react-redux";
import * as Font from "expo-font";

import AppNav from "./AppNav";
import store from "./src/app/store";

const App = () => {
  useEffect(() => {
    (async () =>
      await Font.loadAsync({
        Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
      }))();
  }, []);
  return (
    <Provider store={store}>
      <AppNav />
    </Provider>
  );
};

export default App;
