import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
})

// add token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api

