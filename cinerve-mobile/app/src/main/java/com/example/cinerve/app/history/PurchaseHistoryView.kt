package com.example.cinerve.app.history

import com.example.cinerve.app.model.Booking

interface PurchaseHistoryView {
    fun showLoading()
    fun hideLoading()
    fun showBookings(bookings: List<Booking>)
    fun showError(message: String)
    fun showEmptyState()
    fun showBookingDetail(booking: Booking)
}