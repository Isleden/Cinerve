package com.example.cinerve.app.model

data class Showtime(
    val id: Long,
    val movieId: Long,
    val cinema: String,
    val address: String?,
    val distance: String?,
    val time: String
)