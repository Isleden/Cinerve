package com.example.cinerve.app.seatselection

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.GridLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.example.cinerve.app.R
import com.example.cinerve.app.payment.PaymentActivity

class SeatSelectionActivity : AppCompatActivity(), SeatSelectionView {

    private lateinit var presenter: SeatSelectionPresenter
    private lateinit var tvMovieTitle: TextView
    private lateinit var tvCinemaShowtime: TextView
    private lateinit var tvConfirm: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var gridSeats: GridLayout
    private lateinit var tvSelectedSeats: TextView
    private lateinit var tvTotalAmount: TextView
    private lateinit var llSelectedPanel: LinearLayout

    private val rows = listOf("A", "B", "C", "D", "E", "F", "G", "H")
    private val cols = (1..12).toList()
    private var reservedSeats = listOf<String>()
    private val seatButtons = mutableMapOf<String, TextView>()

    private var movieId: Long = 0
    private var movieTitle: String = ""
    private var cinema: String = ""
    private var showtime: String = ""
    private var posterUrl: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_seat_selection)

        // Get data from intent
        movieId = intent.getLongExtra("MOVIE_ID", 0)
        movieTitle = intent.getStringExtra("MOVIE_TITLE") ?: ""
        cinema = intent.getStringExtra("CINEMA") ?: ""
        showtime = intent.getStringExtra("SHOWTIME") ?: ""
        posterUrl = intent.getStringExtra("POSTER_URL")

        // Init views
        tvMovieTitle = findViewById(R.id.tvMovieTitle)
        tvCinemaShowtime = findViewById(R.id.tvCinemaShowtime)
        tvConfirm = findViewById(R.id.btnConfirm)
        progressBar = findViewById(R.id.progressBar)
        gridSeats = findViewById(R.id.gridSeats)
        tvSelectedSeats = findViewById(R.id.tvSelectedSeats)
        tvTotalAmount = findViewById(R.id.tvTotalAmount)
        llSelectedPanel = findViewById(R.id.llSelectedPanel)

        tvMovieTitle.text = movieTitle
        tvCinemaShowtime.text = "$cinema • $showtime"

        presenter = SeatSelectionPresenter(this)

        // Build seat grid
        buildSeatGrid()

        // Load reserved seats
        presenter.loadReservedSeats(movieId, cinema, showtime)

        // Back button
        findViewById<View>(R.id.btnBack).setOnClickListener { finish() }

        // Confirm button
        tvConfirm.setOnClickListener {
            presenter.onConfirmClicked(movieId, movieTitle, cinema, showtime, posterUrl)
        }
    }

    private fun buildSeatGrid() {
        gridSeats.removeAllViews()
        gridSeats.rowCount = rows.size
        gridSeats.columnCount = cols.size + 1 // +1 for row label

        rows.forEach { row ->
            // Row label
            val label = TextView(this).apply {
                text = row
                setTextColor(Color.parseColor("#6B7280"))
                textSize = 13f
                gravity = android.view.Gravity.CENTER
                val params = GridLayout.LayoutParams().apply {
                    width = 28
                    height = 36
                    setMargins(0, 4, 8, 4)
                }
                layoutParams = params
            }
            gridSeats.addView(label)

            cols.forEach { col ->
                val seatId = "$row$col"
                val seatView = TextView(this).apply {
                    text = col.toString()
                    textSize = 11f
                    gravity = android.view.Gravity.CENTER
                    setTextColor(Color.parseColor("#9CA3AF"))
                    setBackgroundResource(R.drawable.seat_available_background)
                    val params = GridLayout.LayoutParams().apply {
                        width = 36
                        height = 36
                        setMargins(3, 4, 3, 4)
                    }
                    layoutParams = params
                    setOnClickListener {
                        presenter.onSeatClicked(seatId, reservedSeats)
                        updateSeatAppearance()
                    }
                }
                seatButtons[seatId] = seatView
                gridSeats.addView(seatView)
            }
        }
    }

    private fun updateSeatAppearance() {
        val selected = presenter.getSelectedSeats()
        seatButtons.forEach { (seatId, view) ->
            when {
                reservedSeats.contains(seatId) -> {
                    view.setBackgroundResource(R.drawable.seat_reserved_background)
                    view.setTextColor(Color.parseColor("#4B5563"))
                    view.isClickable = false
                }
                selected.contains(seatId) -> {
                    view.setBackgroundResource(R.drawable.seat_selected_background)
                    view.setTextColor(Color.WHITE)
                }
                else -> {
                    view.setBackgroundResource(R.drawable.seat_available_background)
                    view.setTextColor(Color.parseColor("#9CA3AF"))
                }
            }
        }
    }

    override fun showLoading() {
        progressBar.visibility = View.VISIBLE
    }

    override fun hideLoading() {
        progressBar.visibility = View.GONE
    }

    override fun showReservedSeats(seats: List<String>) {
        reservedSeats = seats
        updateSeatAppearance()
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    override fun updateSelectedSeats(seats: List<String>, total: Int) {
        if (seats.isEmpty()) {
            llSelectedPanel.visibility = View.GONE
            tvConfirm.text = "Confirm (0)"
        } else {
            llSelectedPanel.visibility = View.VISIBLE
            tvSelectedSeats.text = seats.sorted().joinToString(", ")
            tvTotalAmount.text = "₱${total.toString().replace(Regex("(\\d)(?=(\\d{3})+\$)"), "$1,")}"
            tvConfirm.text = "Confirm (${seats.size})"
        }
    }

    override fun navigateToPayment(
        movieId: Long,
        movieTitle: String,
        cinema: String,
        showtime: String,
        posterUrl: String?,
        seats: String,
        totalAmount: Double
    ) {
        val intent = Intent(this, PaymentActivity::class.java).apply {
            putExtra("MOVIE_ID", movieId)
            putExtra("MOVIE_TITLE", movieTitle)
            putExtra("CINEMA", cinema)
            putExtra("SHOWTIME", showtime)
            putExtra("POSTER_URL", posterUrl)
            putExtra("SEATS", seats)
            putExtra("TOTAL_AMOUNT", totalAmount)
        }
        startActivity(intent)
    }
}