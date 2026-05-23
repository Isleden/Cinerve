package com.example.cinerve.app.moviedetail

import com.example.cinerve.app.model.Showtime

interface MovieDetailView {
    fun showLoading()
    fun hideLoading()
    fun showShowtimes(showtimes: List<Showtime>)
    fun showError(message: String)
    fun showNoShowtimes()
    fun navigateToSeatSelection(
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        posterUrl: String?
    )
}