package com.example.cinerve.app.model

data class BookingRequest(
    val username: String,
    val movieId: Long,
    val movieTitle: String,
    val cinema: String,
    val showtime: String,
    val seats: String,
    val totalAmount: Double,
    val paymentMethod: String,
    val posterUrl: String?
)