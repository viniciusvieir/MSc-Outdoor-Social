import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const trailSeek = axios.create({
  baseURL: "https://api.trailseek.eu/v1",
});

trailSeek.interceptors.request.use(async (config) => {
  let token;
  try {
    const value = await AsyncStorage.getItem("@token");
    if (value) {
      token = value;
    }
  } catch (error) {
    console.log(error.response);
  }
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default trailSeek;
