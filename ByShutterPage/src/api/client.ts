import axios from 'axios'

const byShutterApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ORIGIN,
  timeout: 5000,
  withCredentials: true,
})

export default byShutterApi
