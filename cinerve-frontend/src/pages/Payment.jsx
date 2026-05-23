import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createBooking } from '../api/bookings'

const SERVICE_FEE = 50

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    movie = '',
    cinema = '',
    time = '',
    movieId = '',
    poster = '',
    seats = '',
    totalAmount = 0,
  } = location.state || {}

  const username = localStorage.getItem('username') || ''
  const seatList = seats ? seats.split(',') : []
  const ticketTotal = totalAmount
  const grandTotal = ticketTotal + SERVICE_FEE

  const [paymentMethod, setPaymentMethod] = useState('GCash')
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(null)

  const handlePay = async () => {
    if (!paymentMethod) return setError('Please select a payment method.')

    setLoading(true)
    setError('')
    try {
      const res = await createBooking({
        username,
        movieId: parseInt(movieId),
        movieTitle: movie,
        cinema,
        showtime: time,
        seats,
        totalAmount: grandTotal,
        paymentMethod,
        posterUrl: poster,
      })
      setBooking(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100% !important;
          box-sizing: border-box;
        }
        * { box-sizing: border-box; }

        .payment-method-card {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .payment-method-card.selected {
          border-color: #dc2626;
        }
        .pay-btn {
          width: 100%;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 24px;
        }
        .pay-btn:hover:not(:disabled) { background: #b91c1c; }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .mobile-input {
          width: 100%;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 12px 14px;
          color: #fff;
          font-size: 14px;
          font-family: Inter, sans-serif;
          outline: none;
          margin-top: 12px;
        }
        .mobile-input:focus { border-color: #dc2626; }
        .mobile-input::placeholder { color: #6b7280; }
      `}</style>

      <div style={{ width: '100vw', minHeight: '100vh', background: '#000', fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1f2937',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center',
          }}>
            <svg width="20" height="20" fill="none" stroke="#d1d5db" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Payment</h2>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Complete your booking</p>
          </div>
        </div>

        <main style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>

          {/* Booking Summary */}
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 20px' }}>
            Booking Summary
          </h2>

          <div style={{
            background: '#111827', border: '1px solid #1f2937',
            borderRadius: 12, padding: 24, marginBottom: 32,
          }}>
            {[
              { label: 'Movie', value: movie },
              { label: 'Cinema', value: cinema },
              { label: 'Showtime', value: time },
              { label: 'Selected Seats', value: `${seatList.join(', ')}`, sub: `${seatList.length} seats` },
            ].map((item, i) => (
              <div key={item.label} style={{
                paddingBottom: 16, marginBottom: 16,
                borderBottom: '1px solid #1f2937',
              }}>
                <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 4px' }}>{item.label}</p>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>{item.value}</p>
                {item.sub && <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>{item.sub}</p>}
              </div>
            ))}

            {/* Price breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#9ca3af', fontSize: 14 }}>
                Ticket Price ({seatList.length}x ₱{350})
              </span>
              <span style={{ color: '#fff', fontSize: 14 }}>₱{ticketTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#9ca3af', fontSize: 14 }}>Service Fee</span>
              <span style={{ color: '#fff', fontSize: 14 }}>₱{SERVICE_FEE}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: 16, borderTop: '1px solid #1f2937',
            }}>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Total Amount</span>
              <span style={{ color: '#dc2626', fontSize: 22, fontWeight: 700 }}>
                ₱{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>
            Payment Method
          </h2>

          {/* GCash */}
          <div
            className={`payment-method-card ${paymentMethod === 'GCash' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('GCash')}
            style={{ marginBottom: 12 }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#1877F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>GCash</p>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Pay using your GCash wallet</p>
            </div>
            {paymentMethod === 'GCash' && (
              <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>

          {/* QR Ph */}
          <div
            className={`payment-method-card ${paymentMethod === 'QR Ph' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('QR Ph')}
            style={{ marginBottom: 24 }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#7c3aed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" />
                <rect x="19" y="14" width="2" height="2" /><rect x="14" y="19" width="2" height="2" />
                <rect x="18" y="18" width="3" height="3" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>QR Ph</p>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Scan QR code to pay with any bank</p>
            </div>
            {paymentMethod === 'QR Ph' && (
              <svg width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>

          {/* QR Code placeholder */}
          <div style={{
            background: '#111827', border: '1px solid #1f2937',
            borderRadius: 12, padding: 24, textAlign: 'center',
            marginBottom: 24,
          }}>
            {/* QR Code SVG placeholder */}
            <div style={{
              width: 160, height: 160, margin: '0 auto 16px',
              background: '#fff', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <rect x="10" y="10" width="40" height="40" fill="#000"/>
                <rect x="15" y="15" width="30" height="30" fill="#fff"/>
                <rect x="20" y="20" width="20" height="20" fill="#000"/>
                <rect x="70" y="10" width="40" height="40" fill="#000"/>
                <rect x="75" y="15" width="30" height="30" fill="#fff"/>
                <rect x="80" y="20" width="20" height="20" fill="#000"/>
                <rect x="10" y="70" width="40" height="40" fill="#000"/>
                <rect x="15" y="75" width="30" height="30" fill="#fff"/>
                <rect x="20" y="80" width="20" height="20" fill="#000"/>
                <rect x="70" y="70" width="10" height="10" fill="#000"/>
                <rect x="85" y="70" width="10" height="10" fill="#000"/>
                <rect x="100" y="70" width="10" height="10" fill="#000"/>
                <rect x="70" y="85" width="10" height="10" fill="#000"/>
                <rect x="90" y="85" width="20" height="10" fill="#000"/>
                <rect x="70" y="100" width="10" height="10" fill="#000"/>
                <rect x="85" y="100" width="25" height="10" fill="#000"/>
              </svg>
            </div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
              Scan this QR code with {paymentMethod}
            </p>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 16px' }}>
              Open {paymentMethod} app and scan to pay
            </p>
            <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 8px' }}>Or enter mobile number</p>
            <input
              className="mobile-input"
              type="tel"
              placeholder="09XX XXX XXXX"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 8, padding: '12px 16px', color: '#f87171',
              fontSize: 13, marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                flex: 1, padding: '13px', borderRadius: 8,
                background: 'transparent', border: '1px solid #374151',
                color: '#d1d5db', fontSize: 14, fontWeight: 600,
                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              }}
            >
              Back to Seat Selection
            </button>
            <button
              className="pay-btn"
              style={{ flex: 2, marginTop: 0 }}
              disabled={loading}
              onClick={handlePay}
            >
              {loading ? 'Processing...' : `Pay ₱${grandTotal.toLocaleString()}`}
            </button>
          </div>
        </main>
      </div>

      {/* Payment Success Modal */}
      {booking && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* Green checkmark */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="32" height="32" fill="none" stroke="white" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>
              Payment Successful!
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 24px', textAlign: 'center' }}>
              Your booking has been confirmed
            </p>

            {/* Booking Reference */}
            <div style={{
              background: '#0d1420', border: '1px solid #1f2937',
              borderRadius: 10, padding: 20, marginBottom: 20, textAlign: 'center',
            }}>
              <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 8px' }}>Booking Reference</p>
              <p style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '2px' }}>
                {booking.bookingReference}
              </p>
              <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Present this reference number to the cashier to claim your tickets</p>
            </div>
            
            {/* Cashier Notice */}
            <div style={{
              background: 'rgba(234,179,8,0.1)',
              border: '1px solid rgba(234,179,8,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>🎟️</span>
              <p style={{ color: '#fde047', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                Please show this reference code to the cashier at the cinema to claim your tickets.
              </p>
            </div>

            {/* Booking details */}
            <div style={{
              background: '#0d1420', border: '1px solid #1f2937',
              borderRadius: 10, padding: 20, marginBottom: 24,
            }}>
              {[
                { label: 'Movie', value: booking.movieTitle },
                { label: 'Cinema', value: booking.cinema },
                { label: 'Showtime', value: booking.showtime },
                { label: 'Seats', value: booking.seats },
                { label: 'Payment Method', value: booking.paymentMethod },
              ].map((item, i, arr) => (
                <div key={item.label} style={{
                  paddingBottom: i < arr.length - 1 ? 12 : 0,
                  marginBottom: i < arr.length - 1 ? 12 : 0,
                  borderBottom: i < arr.length - 1 ? '1px solid #1f2937' : 'none',
                }}>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                background: '#dc2626', border: 'none',
                color: '#fff', fontSize: 15, fontWeight: 700,
                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
    backdropFilter: 'blur(4px)',
    overflowY: 'auto',
  },
  modal: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
  },
}