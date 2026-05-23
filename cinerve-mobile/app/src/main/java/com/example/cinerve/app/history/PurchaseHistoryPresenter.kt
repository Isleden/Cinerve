package com.example.cinerve.app.history

import com.example.cinerve.app.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PurchaseHistoryPresenter(private val view: PurchaseHistoryView) {

    private val apiService = RetrofitClient.apiService

    fun loadHistory(username: String) {
        view.showLoading()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = apiService.getBookingHistory(username)
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    if (response.isSuccessful && response.body() != null) {
                        val bookings = response.body()!!
                        if (bookings.isEmpty()) {
                            view.showEmptyState()
                        } else {
                            view.showBookings(bookings)
                        }
                    } else {
                        view.showError("Failed to load bookings")
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

    fun onBookingClicked(booking: com.example.cinerve.app.model.Booking) {
        view.showBookingDetail(booking)
    }
}