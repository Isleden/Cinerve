package com.example.cinerve.app.seatselection

import com.example.cinerve.app.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class SeatSelectionPresenter(private val view: SeatSelectionView) {

    private val apiService = RetrofitClient.apiService
    private val selectedSeats = mutableListOf<String>()
    private val pricePerSeat = 350

    fun loadReservedSeats(movieId: Long, cinema: String, showtime: String) {
        view.showLoading()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = apiService.getReservedSeats(movieId, cinema, showtime)
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    if (response.isSuccessful && response.body() != null) {
                        view.showReservedSeats(response.body()!!)
                    } else {
                        view.showReservedSeats(emptyList())
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    view.showReservedSeats(emptyList())
                }
            }
        }
    }

    fun onSeatClicked(seatId: String, reservedSeats: List<String>) {
        if (reservedSeats.contains(seatId)) return

        if (selectedSeats.contains(seatId)) {
            selectedSeats.remove(seatId)
        } else {
            selectedSeats.add(seatId)
        }

        view.updateSelectedSeats(selectedSeats.toList(), selectedSeats.size * pricePerSeat)
    }

    fun onConfirmClicked(
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        posterUrl: String?
    ) {
        if (selectedSeats.isEmpty()) return

        view.navigateToPayment(
            movieId,
            movieTitle,
            cinema,
            showtime,
            posterUrl,
            selectedSeats.sorted().joinToString(","),
            selectedSeats.size * pricePerSeat.toDouble()
        )
    }

    fun getSelectedSeats(): List<String> = selectedSeats.toList()
}