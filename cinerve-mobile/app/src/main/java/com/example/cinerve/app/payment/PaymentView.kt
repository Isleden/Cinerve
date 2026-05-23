package com.example.cinerve.app.payment

import com.example.cinerve.app.model.Booking

interface PaymentView {
    fun showLoading()
    fun hideLoading()
    fun onPaymentSuccess(booking: Booking)
    fun onPaymentError(message: String)
}