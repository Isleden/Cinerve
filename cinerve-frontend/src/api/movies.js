import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8080/api' })

export const getAllMovies = () => API.get('/movies')
export const getMovieById = (id) => API.get(`/movies/${id}`)
export const addMovie = (data) => API.post('/movies', data)
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data)
export const deleteMovie = (id) => API.delete(`/movies/${id}`)