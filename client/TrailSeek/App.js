import React from "react";
import { Provider } from "react-redux";

import AppNav from "./AppNav";
import store from "./src/app/store";

const App = () => {
  return (
    <Provider store={store}>
      <AppNav />
    </Provider>
  );
};

export default App;
