package com.example.cinerve.app.seatselection

interface SeatSelectionView {
    fun showLoading()
    fun hideLoading()
    fun showReservedSeats(seats: List<String>)
    fun showError(message: String)
    fun updateSelectedSeats(seats: List<String>, total: Int)
    fun navigateToPayment(
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        posterUrl: String?,
        seats: String,
        totalAmount: Double
    )
}