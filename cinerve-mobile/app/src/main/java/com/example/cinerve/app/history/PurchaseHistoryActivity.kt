package com.example.cinerve.app.history

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide
import com.example.cinerve.app.R
import com.example.cinerve.app.model.Booking

class PurchaseHistoryActivity : AppCompatActivity(), PurchaseHistoryView {

    private lateinit var presenter: PurchaseHistoryPresenter
    private lateinit var progressBar: ProgressBar
    private lateinit var tvEmptyState: TextView
    private lateinit var llBookings: LinearLayout
    private lateinit var llTicketModal: LinearLayout
    private lateinit var tvBookingRef: TextView
    private lateinit var tvTicketMovie: TextView
    private lateinit var tvTicketCinema: TextView
    private lateinit var tvTicketShowtime: TextView
    private lateinit var tvTicketSeats: TextView
    private lateinit var tvTicketPayment: TextView
    private lateinit var tvTicketStatus: TextView
    private lateinit var btnCloseTicket: Button
    private lateinit var btnAll: Button
    private lateinit var btnUpcoming: Button
    private lateinit var btnCompleted: Button

    private var allBookings = listOf<Booking>()
    private var currentFilter = "All"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_purchase_history)

        // Init views
        progressBar = findViewById(R.id.progressBar)
        tvEmptyState = findViewById(R.id.tvEmptyState)
        llBookings = findViewById(R.id.llBookings)
        llTicketModal = findViewById(R.id.llTicketModal)
        tvBookingRef = findViewById(R.id.tvBookingRef)
        tvTicketMovie = findViewById(R.id.tvTicketMovie)
        tvTicketCinema = findViewById(R.id.tvTicketCinema)
        tvTicketShowtime = findViewById(R.id.tvTicketShowtime)
        tvTicketSeats = findViewById(R.id.tvTicketSeats)
        tvTicketPayment = findViewById(R.id.tvTicketPayment)
        tvTicketStatus = findViewById(R.id.tvTicketStatus)
        btnCloseTicket = findViewById(R.id.btnCloseTicket)
        btnAll = findViewById(R.id.btnAll)
        btnUpcoming = findViewById(R.id.btnUpcoming)
        btnCompleted = findViewById(R.id.btnCompleted)

        presenter = PurchaseHistoryPresenter(this)

        // Back button
        findViewById<View>(R.id.btnBack).setOnClickListener { finish() }

        // Close ticket modal
        btnCloseTicket.setOnClickListener {
            llTicketModal.visibility = View.GONE
        }

        // Filter buttons
        btnAll.setOnClickListener { applyFilter("All") }
        btnUpcoming.setOnClickListener { applyFilter("Upcoming") }
        btnCompleted.setOnClickListener { applyFilter("Completed") }

        // Load history
        val username = getSharedPreferences("cinerve_prefs", MODE_PRIVATE)
            .getString("username", "") ?: ""
        presenter.loadHistory(username)
    }

    private fun applyFilter(filter: String) {
        currentFilter = filter

        // Update button styles
        val activeColor = 0xFFDC2626.toInt()
        val inactiveColor = 0xFF1F2937.toInt()
        btnAll.setBackgroundColor(if (filter == "All") activeColor else inactiveColor)
        btnUpcoming.setBackgroundColor(if (filter == "Upcoming") activeColor else inactiveColor)
        btnCompleted.setBackgroundColor(if (filter == "Completed") activeColor else inactiveColor)

        val filtered = when (filter) {
            "Upcoming" -> allBookings.filter { it.status == "UPCOMING" }
            "Completed" -> allBookings.filter { it.status == "COMPLETED" }
            else -> allBookings
        }

        renderBookings(filtered)
    }

    private fun renderBookings(bookings: List<Booking>) {
        llBookings.removeAllViews()

        if (bookings.isEmpty()) {
            tvEmptyState.visibility = View.VISIBLE
            tvEmptyState.text = "No ${currentFilter.lowercase()} bookings found."
            llBookings.visibility = View.GONE
            return
        }

        tvEmptyState.visibility = View.GONE
        llBookings.visibility = View.VISIBLE

        bookings.forEach { booking ->
            val itemView = LayoutInflater.from(this)
                .inflate(R.layout.item_booking, llBookings, false)

            itemView.findViewById<TextView>(R.id.tvBookingMovieTitle).text = booking.movieTitle
            itemView.findViewById<TextView>(R.id.tvBookingCinema).text = booking.cinema
            itemView.findViewById<TextView>(R.id.tvBookingShowtime).text = booking.showtime
            itemView.findViewById<TextView>(R.id.tvBookingSeats).text = "Seats: ${booking.seats}"
            itemView.findViewById<TextView>(R.id.tvBookingAmount).text =
                "₱${booking.totalAmount.toInt().toLocaleString()}"

            val statusView = itemView.findViewById<TextView>(R.id.tvBookingStatus)
            statusView.text = if (booking.status == "UPCOMING") "Upcoming" else "Completed"
            statusView.setBackgroundColor(
                if (booking.status == "UPCOMING") 0x333B82F6.toInt() else 0x3322C55E.toInt()
            )
            statusView.setTextColor(
                if (booking.status == "UPCOMING") 0xFF60A5FA.toInt() else 0xFF4ADE80.toInt()
            )

            // Load poster
            val ivPoster = itemView.findViewById<android.widget.ImageView>(R.id.ivBookingPoster)
            if (!booking.posterUrl.isNullOrEmpty()) {
                Glide.with(this).load(booking.posterUrl)
                    .placeholder(R.drawable.ic_launcher_background)
                    .into(ivPoster)
            }

            itemView.setOnClickListener {
                presenter.onBookingClicked(booking)
            }

            llBookings.addView(itemView)
        }
    }

    private fun Int.toLocaleString(): String {
        return toString().replace(Regex("(\\d)(?=(\\d{3})+\$)"), "$1,")
    }

    override fun showLoading() {
        progressBar.visibility = View.VISIBLE
        llBookings.visibility = View.GONE
        tvEmptyState.visibility = View.GONE
    }

    override fun hideLoading() {
        progressBar.visibility = View.GONE
    }

    override fun showBookings(bookings: List<Booking>) {
        allBookings = bookings
        applyFilter(currentFilter)
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        tvEmptyState.visibility = View.VISIBLE
        tvEmptyState.text = message
    }

    override fun showEmptyState() {
        tvEmptyState.visibility = View.VISIBLE
        tvEmptyState.text = "No bookings yet."
        llBookings.visibility = View.GONE
    }

    override fun showBookingDetail(booking: Booking) {
        llTicketModal.visibility = View.VISIBLE
        tvBookingRef.text = booking.bookingReference
        tvTicketMovie.text = booking.movieTitle
        tvTicketCinema.text = booking.cinema
        tvTicketShowtime.text = booking.showtime
        tvTicketSeats.text = booking.seats
        tvTicketPayment.text = booking.paymentMethod
        tvTicketStatus.text = if (booking.status == "UPCOMING") "🎬 Upcoming" else "✅ Completed"
        tvTicketStatus.setTextColor(
            if (booking.status == "UPCOMING") 0xFF60A5FA.toInt() else 0xFF4ADE80.toInt()
        )
    }
}