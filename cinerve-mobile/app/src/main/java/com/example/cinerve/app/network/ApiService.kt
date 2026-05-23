package com.example.cinerve.app.network

import com.example.cinerve.app.login.LoginResponse
import com.example.cinerve.app.model.Booking
import com.example.cinerve.app.model.BookingRequest
import com.example.cinerve.app.model.Movie
import com.example.cinerve.app.model.Showtime
import retrofit2.Response
import retrofit2.http.*

data class LoginRequest(val username: String, val password: String)

interface ApiService {

    // ── AUTH ──
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    // ── MOVIES ──
    @GET("api/movies")
    suspend fun getMovies(): Response<List<Movie>>

    // ── SHOWTIMES ──
    @GET("api/showtimes")
    suspend fun getShowtimes(@Query("movieId") movieId: Long): Response<List<Showtime>>

    // ── BOOKINGS ──
    @POST("api/bookings")
    suspend fun createBooking(@Body request: BookingRequest): Response<Booking>

    @GET("api/bookings/history")
    suspend fun getBookingHistory(@Query("username") username: String): Response<List<Booking>>

    @GET("api/bookings/seats")
    suspend fun getReservedSeats(
        @Query("movieId") movieId: Long,
        @Query("cinema") cinema: String,
        @Query("showtime") showtime: String
    ): Response<List<String>>
}