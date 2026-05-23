import axios from 'axios'

const API = axios.create({ baseURL: 'https://cinerve.onrender.com/api' })

export const getProfile = (username) => API.get(`/user/profile?username=${username}`)
export const updateProfile = (username, data) => API.put(`/user/profile?username=${username}`, data)
export const changePassword = (username, data) => API.put(`/user/password?username=${username}`, data)
export const uploadPhoto = (username, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post(`/user/photo?username=${username}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}