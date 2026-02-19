import axios from 'axios'
import { BASE_URL } from './api.js'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }

})
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  const isAuthFreeRoute =
    config.url.includes("/reset-password") ||
    config.url.includes("/forget-password") ||
    config.url.includes("/login") ||
    config.url.includes("/register")

  if (token && !isAuthFreeRoute) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
export { axiosInstance }