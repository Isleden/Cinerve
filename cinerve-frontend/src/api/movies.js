import axios from 'axios'

const API = axios.create({ baseURL: 'https://cinerve.onrender.com/api' })

export const getAllMovies = () => API.get('/movies')
export const getMovieById = (id) => API.get(`/movies/${id}`)
export const addMovie = (data) => API.post('/movies', data)
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data)
export const deleteMovie = (id) => API.delete(`/movies/${id}`)
export const getShowtimes = (movieId) => API.get(`/showtimes?movieId=${movieId}`)
export const addShowtime = (data) => API.post('/showtimes', data)
export const deleteShowtime = (id) => API.delete(`/showtimes/${id}`)