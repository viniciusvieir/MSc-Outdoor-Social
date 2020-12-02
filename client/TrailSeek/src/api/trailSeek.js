import axios from 'axios'
import { getToken } from '../util/auth'

const trailSeek = axios.create({
  baseURL: 'https://api.trailseek.eu/v1',
  // baseURL: 'http://192.168.86.20:4040',
})

trailSeek.interceptors.request.use(async (config) => {
  const token = await getToken()
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

export default trailSeek

export const trailSeekAuth = axios.create({
  baseURL: 'https://api.trailseek.eu/v1',
})
