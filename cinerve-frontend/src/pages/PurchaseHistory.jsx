import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookingHistory } from '../api/bookings'

export default function PurchaseHistory() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || ''

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await getBookingHistory(username)
      setBookings(res.data)
    } catch (err) {
      setError('Failed to load booking history.')
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === 'All') return true
    if (filter === 'Upcoming') return b.status === 'UPCOMING'
    if (filter === 'Completed') return b.status === 'COMPLETED'
    return true
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

        .filter-btn {
          padding: 8px 20px;
          border-radius: 20px;
          border: 1px solid #374151;
          background: transparent;
          color: #9ca3af;
          font-size: 14px;
          font-weight: 500;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-btn.active {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
        }
        .filter-btn:not(.active):hover {
          border-color: #6b7280;
          color: #fff;
        }

        .booking-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          cursor: pointer;
          transition: border-color 0.15s;
          position: relative;
        }
        .booking-card:hover { border-color: #374151; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton {
          animation: pulse 1.8s ease-in-out infinite;
          background: #1f2937;
          border-radius: 6px;
        }
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
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            display: 'flex', alignItems: 'center',
          }}>
            <svg width="20" height="20" fill="none" stroke="#d1d5db" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Purchase History</h2>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>View all your bookings</p>
          </div>
        </div>

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            {['All', 'Upcoming', 'Completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'All' ? 'All Bookings' : f}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 8, padding: '12px 16px', color: '#f87171',
              fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  background: '#111827', border: '1px solid #1f2937',
                  borderRadius: 12, padding: 20, display: 'flex', gap: 16,
                }}>
                  <div className="skeleton" style={{ width: 70, height: 90, borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 18, width: '50%' }} />
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    <div className="skeleton" style={{ height: 20, width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <svg width="48" height="48" fill="none" stroke="#374151" strokeWidth="1.5"
                viewBox="0 0 24 24" style={{ margin: '0 auto 16px', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>
                No {filter === 'All' ? '' : filter.toLowerCase()} bookings found.
              </p>
            </div>
          )}

          {/* Booking List */}
          {!loading && filteredBookings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredBookings.map(booking => (
                <div key={booking.id} className="booking-card">

                  {/* Poster */}
                  {booking.posterUrl ? (
                    <img src={booking.posterUrl} alt={booking.movieTitle}
                      style={{ width: 70, height: 95, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 70, height: 95, background: '#1f2937',
                      borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="24" height="24" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>
                      {booking.movieTitle}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {/* Cinema */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>{booking.cinema}</span>
                      </div>

                      {/* Date + Time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span style={{ color: '#9ca3af', fontSize: 13 }}>{formatDate(booking.createdAt)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span style={{ color: '#9ca3af', fontSize: 13 }}>{booking.showtime}</span>
                        </div>
                      </div>

                      {/* Seats */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span style={{ color: '#9ca3af', fontSize: 13 }}>Seats: {booking.seats}</span>
                      </div>

                      {/* Total */}
                      <div style={{ marginTop: 4 }}>
                        <p style={{ color: '#6b7280', fontSize: 11, margin: '0 0 2px' }}>Total Amount</p>
                        <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>
                          ₱{booking.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status badge + arrow */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: booking.status === 'UPCOMING' ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)',
                      color: booking.status === 'UPCOMING' ? '#60a5fa' : '#4ade80',
                    }}>
                      {booking.status === 'UPCOMING' ? 'Upcoming' : 'Completed'}
                    </span>
                    <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}