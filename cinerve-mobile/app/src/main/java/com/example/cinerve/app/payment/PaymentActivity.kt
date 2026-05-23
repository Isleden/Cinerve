package com.example.cinerve.app.payment

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.cinerve.app.R
import com.example.cinerve.app.home.HomeActivity
import com.example.cinerve.app.model.Booking

class PaymentActivity : AppCompatActivity(), PaymentView {

    private lateinit var presenter: PaymentPresenter
    private lateinit var tvMovie: TextView
    private lateinit var tvCinema: TextView
    private lateinit var tvShowtime: TextView
    private lateinit var tvSeats: TextView
    private lateinit var tvSeatCount: TextView
    private lateinit var tvTicketPrice: TextView
    private lateinit var tvServiceFee: TextView
    private lateinit var tvTotalAmount: TextView
    private lateinit var rgPaymentMethod: RadioGroup
    private lateinit var rbGcash: RadioButton
    private lateinit var rbQrPh: RadioButton
    private lateinit var btnPay: Button
    private lateinit var btnBack: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var llSuccessModal: LinearLayout
    private lateinit var tvBookingReference: TextView
    private lateinit var tvSuccessMovie: TextView
    private lateinit var tvSuccessCinema: TextView
    private lateinit var tvSuccessShowtime: TextView
    private lateinit var tvSuccessSeats: TextView
    private lateinit var tvSuccessPayment: TextView
    private lateinit var btnBackToHome: Button

    private var movieId: Long = 0
    private var movieTitle: String = ""
    private var cinema: String = ""
    private var showtime: String = ""
    private var posterUrl: String? = null
    private var seats: String = ""
    private var totalAmount: Double = 0.0
    private val serviceFee = 50.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_payment)

        // Get data from intent
        movieId = intent.getLongExtra("MOVIE_ID", 0)
        movieTitle = intent.getStringExtra("MOVIE_TITLE") ?: ""
        cinema = intent.getStringExtra("CINEMA") ?: ""
        showtime = intent.getStringExtra("SHOWTIME") ?: ""
        posterUrl = intent.getStringExtra("POSTER_URL")
        seats = intent.getStringExtra("SEATS") ?: ""
        totalAmount = intent.getDoubleExtra("TOTAL_AMOUNT", 0.0)

        // Init views
        tvMovie = findViewById(R.id.tvMovie)
        tvCinema = findViewById(R.id.tvCinema)
        tvShowtime = findViewById(R.id.tvShowtime)
        tvSeats = findViewById(R.id.tvSeats)
        tvSeatCount = findViewById(R.id.tvSeatCount)
        tvTicketPrice = findViewById(R.id.tvTicketPrice)
        tvServiceFee = findViewById(R.id.tvServiceFee)
        tvTotalAmount = findViewById(R.id.tvTotalAmount)
        rgPaymentMethod = findViewById(R.id.rgPaymentMethod)
        rbGcash = findViewById(R.id.rbGcash)
        rbQrPh = findViewById(R.id.rbQrPh)
        btnPay = findViewById(R.id.btnPay)
        btnBack = findViewById(R.id.btnBack)
        progressBar = findViewById(R.id.progressBar)
        llSuccessModal = findViewById(R.id.llSuccessModal)
        tvBookingReference = findViewById(R.id.tvBookingReference)
        tvSuccessMovie = findViewById(R.id.tvSuccessMovie)
        tvSuccessCinema = findViewById(R.id.tvSuccessCinema)
        tvSuccessShowtime = findViewById(R.id.tvSuccessShowtime)
        tvSuccessSeats = findViewById(R.id.tvSuccessSeats)
        tvSuccessPayment = findViewById(R.id.tvSuccessPayment)
        btnBackToHome = findViewById(R.id.btnBackToHome)

        presenter = PaymentPresenter(this)

        // Bind data
        val seatList = seats.split(",")
        val seatCount = seatList.size
        val pricePerSeat = 350

        tvMovie.text = movieTitle
        tvCinema.text = cinema
        tvShowtime.text = showtime
        tvSeats.text = seats
        tvSeatCount.text = "$seatCount seats"
        tvTicketPrice.text = "₱${(seatCount * pricePerSeat).toLocaleString()}"
        tvServiceFee.text = "₱${serviceFee.toInt()}"
        tvTotalAmount.text = "₱${(totalAmount + serviceFee).toLocaleString()}"

        btnPay.text = "Pay ₱${(totalAmount + serviceFee).toLocaleString()}"

        btnBack.setOnClickListener { finish() }

        btnPay.setOnClickListener {
            val paymentMethod = if (rbGcash.isChecked) "GCash" else "QR Ph"
            val username = getSharedPreferences("cinerve_prefs", MODE_PRIVATE)
                .getString("username", "") ?: ""

            presenter.processPayment(
                username = username,
                movieId = movieId,
                movieTitle = movieTitle,
                cinema = cinema,
                showtime = showtime,
                seats = seats,
                ticketTotal = totalAmount,
                paymentMethod = paymentMethod,
                posterUrl = posterUrl
            )
        }

        btnBackToHome.setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish()
        }
    }

    private fun Int.toLocaleString(): String {
        return toString().replace(Regex("(\\d)(?=(\\d{3})+\$)"), "$1,")
    }

    private fun Double.toLocaleString(): String {
        return toInt().toLocaleString()
    }

    override fun showLoading() {
        progressBar.visibility = View.VISIBLE
        btnPay.isEnabled = false
    }

    override fun hideLoading() {
        progressBar.visibility = View.GONE
        btnPay.isEnabled = true
    }

    override fun onPaymentSuccess(booking: Booking) {
        llSuccessModal.visibility = View.VISIBLE
        tvBookingReference.text = booking.bookingReference
        tvSuccessMovie.text = booking.movieTitle
        tvSuccessCinema.text = booking.cinema
        tvSuccessShowtime.text = booking.showtime
        tvSuccessSeats.text = booking.seats
        tvSuccessPayment.text = booking.paymentMethod
    }

    override fun onPaymentError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}