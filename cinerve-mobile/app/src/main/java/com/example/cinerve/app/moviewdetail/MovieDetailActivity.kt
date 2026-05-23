package com.example.cinerve.app.moviedetail

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import com.example.cinerve.app.R
import com.example.cinerve.app.model.Movie
import com.example.cinerve.app.model.Showtime
import com.example.cinerve.app.seatselection.SeatSelectionActivity

class MovieDetailActivity : AppCompatActivity(), MovieDetailView {

    private lateinit var presenter: MovieDetailPresenter
    private lateinit var ivPoster: ImageView
    private lateinit var tvTitle: TextView
    private lateinit var tvGenre: TextView
    private lateinit var tvRating: TextView
    private lateinit var tvDuration: TextView
    private lateinit var tvDescription: TextView
    private lateinit var tvActors: TextView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvNoShowtimes: TextView
    private lateinit var llShowtimes: LinearLayout

    private var movie: Movie? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_movie_detail)

        // Get movie from intent
        movie = intent.getSerializableExtra("MOVIE") as? Movie

        // Init views
        ivPoster = findViewById(R.id.ivPoster)
        tvTitle = findViewById(R.id.tvTitle)
        tvGenre = findViewById(R.id.tvGenre)
        tvRating = findViewById(R.id.tvRating)
        tvDuration = findViewById(R.id.tvDuration)
        tvDescription = findViewById(R.id.tvDescription)
        tvActors = findViewById(R.id.tvActors)
        progressBar = findViewById(R.id.progressBar)
        tvNoShowtimes = findViewById(R.id.tvNoShowtimes)
        llShowtimes = findViewById(R.id.llShowtimes)

        presenter = MovieDetailPresenter(this)

        // Bind movie data
        movie?.let { bindMovie(it) }

        // Back button
        findViewById<View>(R.id.btnBack).setOnClickListener { finish() }

        // Load showtimes
        movie?.let { presenter.loadShowtimes(it.id) }
    }

    private fun bindMovie(movie: Movie) {
        tvTitle.text = movie.title
        tvGenre.text = movie.genre ?: "Unknown"
        tvRating.text = "⭐ ${movie.rating ?: "N/A"}/10"
        tvDuration.text = "🕐 ${movie.duration ?: "N/A"}"
        tvDescription.text = movie.description ?: ""
        tvActors.text = movie.actors ?: ""

        if (!movie.posterUrl.isNullOrEmpty()) {
            Glide.with(this)
                .load(movie.posterUrl)
                .placeholder(R.drawable.ic_launcher_background)
                .into(ivPoster)
        }
    }

    override fun showLoading() {
        progressBar.visibility = View.VISIBLE
        llShowtimes.visibility = View.GONE
        tvNoShowtimes.visibility = View.GONE
    }

    override fun hideLoading() {
        progressBar.visibility = View.GONE
    }

    override fun showShowtimes(showtimes: List<Showtime>) {
        llShowtimes.visibility = View.VISIBLE
        tvNoShowtimes.visibility = View.GONE
        llShowtimes.removeAllViews()

        // Group by cinema
        val grouped = showtimes.groupBy { it.cinema }

        grouped.forEach { (cinema, times) ->
            // Cinema name
            val cinemaView = layoutInflater.inflate(R.layout.item_cinema_showtime, llShowtimes, false)
            cinemaView.findViewById<TextView>(R.id.tvCinemaName).text = cinema
            cinemaView.findViewById<TextView>(R.id.tvCinemaAddress).text =
                "${times.first().address ?: ""} • ${times.first().distance ?: ""}"

            val timesContainer = cinemaView.findViewById<LinearLayout>(R.id.llTimes)

            times.forEach { showtime ->
                val timeBtn = layoutInflater.inflate(R.layout.item_showtime_button, timesContainer, false)
                timeBtn.findViewById<TextView>(R.id.tvTime).text = showtime.time
                timeBtn.setOnClickListener {
                    presenter.onShowtimeSelected(
                        movie!!.id,
                        movie!!.title,
                        cinema,
                        showtime.time,
                        movie!!.posterUrl
                    )
                }
                timesContainer.addView(timeBtn)
            }
            llShowtimes.addView(cinemaView)
        }
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    override fun showNoShowtimes() {
        tvNoShowtimes.visibility = View.VISIBLE
        llShowtimes.visibility = View.GONE
    }

    override fun navigateToSeatSelection(
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        posterUrl: String?
    ) {
        val intent = Intent(this, SeatSelectionActivity::class.java).apply {
            putExtra("MOVIE_ID", movieId)
            putExtra("MOVIE_TITLE", movieTitle)
            putExtra("CINEMA", cinema)
            putExtra("SHOWTIME", showtime)
            putExtra("POSTER_URL", posterUrl)
        }
        startActivity(intent)
    }
}