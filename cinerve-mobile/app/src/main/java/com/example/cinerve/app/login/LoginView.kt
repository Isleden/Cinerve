package com.example.cinerve.app.login

interface LoginView {
    fun showLoading()
    fun hideLoading()
    fun onLoginSuccess(token: String, username: String)
    fun onLoginError(message: String)
    fun showEmptyFieldsError()
}