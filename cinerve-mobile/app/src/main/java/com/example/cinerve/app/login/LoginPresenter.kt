package com.example.cinerve.app.login

import com.example.cinerve.app.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginPresenter(private val view: LoginView) {

    private val apiService = RetrofitClient.apiService

    fun login(username: String, password: String) {
        // Validate empty fields
        if (username.isEmpty() || password.isEmpty()) {
            view.showEmptyFieldsError()
            return
        }

        view.showLoading()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = apiService.login(LoginRequest(username, password))

                withContext(Dispatchers.Main) {
                    view.hideLoading()

                    if (response.isSuccessful && response.body() != null) {
                        val token = response.body()!!.token
                        view.onLoginSuccess(token)
                    } else {
                        view.onLoginError("Invalid credentials")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.hideLoading()
                    view.onLoginError("Network error: ${e.message}")
                }
            }
        }
    }
}