import axiso from 'axios'

export default axiso.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: 'b683b592473451521505990ef238f1f0',
    units: 'metric',
  },
})
