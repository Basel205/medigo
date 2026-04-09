import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medigo_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser    = (data) => api.post('/auth/login',
  new URLSearchParams(data),
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
)

// Providers
export const getProviders  = (params) => api.get('/providers', { params })
export const getProvider   = (id)     => api.get(`/providers/${id}`)
export const getSlots      = (id)     => api.get(`/providers/${id}/slots`)

// Appointments
export const bookAppointment   = (data) => api.post('/appointments', data)
export const getAppointments   = ()     => api.get('/appointments/me')
export const cancelAppointment = (id)   => api.delete(`/appointments/${id}`)