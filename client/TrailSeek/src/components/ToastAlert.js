import { Alert } from "react-native";

const ToastAlert = (msg) => {
  return Alert.alert("", msg, [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
  ]);
};

export default ToastAlert;
