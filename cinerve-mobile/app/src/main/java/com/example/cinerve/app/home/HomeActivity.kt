package com.example.cinerve.app.home

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.cinerve.app.R
import com.example.cinerve.app.adapter.MovieAdapter
import com.example.cinerve.app.model.Movie

class HomeActivity : AppCompatActivity(), HomeView {

    private lateinit var presenter: HomePresenter
    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvEmptyState: TextView
    private lateinit var movieAdapter: MovieAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        presenter = HomePresenter(this)

        recyclerView = findViewById(R.id.rvMovies)
        progressBar = findViewById(R.id.progressBar)
        tvEmptyState = findViewById(R.id.tvEmptyState)

        // Setup RecyclerView
        movieAdapter = MovieAdapter(emptyList())
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = movieAdapter

        // Load movies
        presenter.loadMovies()
    }

    override fun showLoading() {
        progressBar.visibility = View.VISIBLE
        recyclerView.visibility = View.GONE
        tvEmptyState.visibility = View.GONE
    }

    override fun hideLoading() {
        progressBar.visibility = View.GONE
    }

    override fun showMovies(movies: List<Movie>) {
        recyclerView.visibility = View.VISIBLE
        tvEmptyState.visibility = View.GONE
        movieAdapter.updateMovies(movies)
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        tvEmptyState.visibility = View.VISIBLE
        tvEmptyState.text = "Error loading movies"
        recyclerView.visibility = View.GONE
    }

    override fun showEmptyState() {
        tvEmptyState.visibility = View.VISIBLE
        tvEmptyState.text = "No movies available"
        recyclerView.visibility = View.GONE
    }
}