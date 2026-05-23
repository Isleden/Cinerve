package com.example.cinerve.app.payment

import com.example.cinerve.app.model.BookingRequest
import com.example.cinerve.app.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PaymentPresenter(private val view: PaymentView) {

    private val apiService = RetrofitClient.apiService
    private val serviceFee = 50.0

    fun processPayment(
        username: String,
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        seats: String,
        ticketTotal: Double,
        paymentMethod: String,
        posterUrl: String?
    ) {
        view.showLoading()

        val totalAmount = ticketTotal + serviceFee

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = BookingRequest(
                    username = username,
                    movieId = movieId,
                    movieTitle = movieTitle,
                    cinema = cinema,
                    showtime = showtime,
                    seats = seats,
                    totalAmount = totalAmount,
                    paymentMethod = paymentMethod,
                    posterUrl = posterUrl
                )

                val response = apiService.createBooking(request)

                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    if (response.isSuccessful && response.body() != null) {
                        view.onPaymentSuccess(response.body()!!)
                    } else {
                        view.onPaymentError("Payment failed. Please try again.")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    view.onPaymentError("Network error: ${e.message}")
                }
            }
        }
    }

    fun getServiceFee() = serviceFee
}