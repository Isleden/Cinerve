import axios from 'axios'

const API = axios.create({ baseURL: 'https://cinerve.onrender.com/api' })

export const getReservedSeats = (movieId, cinema, showtime) =>
  API.get(`/bookings/seats?movieId=${movieId}&cinema=${encodeURIComponent(cinema)}&showtime=${encodeURIComponent(showtime)}`)

export const createBooking = (data) => API.post('/bookings', data)

export const getBookingHistory = (username) =>
  API.get(`/bookings/history?username=${encodeURIComponent(username)}`)