import axiso from "axios";

export default axiso.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    units: "metric",
  },
});
