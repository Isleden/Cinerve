package com.example.cinerve.app.home

import com.example.cinerve.app.model.Movie

interface HomeView {
    fun showLoading()
    fun hideLoading()
    fun showMovies(movies: List<Movie>)
    fun showError(message: String)
    fun showEmptyState()
}