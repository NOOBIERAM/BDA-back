import axios from 'axios'

import { getAuthToken } from '../utils/auth.utils'

const baseURL =
  (import.meta.env.VITE_BACK_URI as string | undefined)?.trim() || 'http://localhost:8002'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
