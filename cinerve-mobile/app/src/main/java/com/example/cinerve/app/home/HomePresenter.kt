package com.example.cinerve.app.home

import com.example.cinerve.app.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class HomePresenter(private val view: HomeView) {

    private val apiService = RetrofitClient.apiService

    fun loadMovies() {
        view.showLoading()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = apiService.getMovies()

                withContext(Dispatchers.Main) {
                    view.hideLoading()

                    if (response.isSuccessful && response.body() != null) {
                        val movies = response.body()!!
                        if (movies.isEmpty()) {
                            view.showEmptyState()
                        } else {
                            view.showMovies(movies)
                        }
                    } else {
                        view.showError("Failed to load movies: ${response.code()}")
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
}