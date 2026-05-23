package com.example.cinerve.app.moviedetail

import com.example.cinerve.app.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MovieDetailPresenter(private val view: MovieDetailView) {

    private val apiService = RetrofitClient.apiService

    fun loadShowtimes(movieId: Long) {
        view.showLoading()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = apiService.getShowtimes(movieId)
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    if (response.isSuccessful && response.body() != null) {
                        val showtimes = response.body()!!
                        if (showtimes.isEmpty()) {
                            view.showNoShowtimes()
                        } else {
                            view.showShowtimes(showtimes)
                        }
                    } else {
                        view.showError("Failed to load showtimes")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    view.showError("Network error: ${e.message}")
                }
            }
        }
    }

    fun onShowtimeSelected(
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        posterUrl: String?
    ) {
        view.navigateToSeatSelection(movieId, movieTitle, cinema, showtime, posterUrl)
    }
}