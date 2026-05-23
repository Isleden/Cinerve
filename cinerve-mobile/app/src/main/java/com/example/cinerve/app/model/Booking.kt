package com.example.cinerve.app.model

data class Booking(
    val id: Long,
    val username: String,
    val movieId: Long,
    val movieTitle: String,
    val cinema: String,
    val showtime: String,
    val seats: String,
    val totalAmount: Double,
    val paymentMethod: String,
    val bookingReference: String,
    val status: String,
    val posterUrl: String?,
    val createdAt: String?
)