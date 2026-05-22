import { useState, useEffect } from 'react'
import { AdminNavbar } from '../components/AdminNavbar'
import axios from 'axios'

const API = axios.create({ baseURL: 'https://cinerve.onrender.com/api' })

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await API.get('/bookings/all')
      setBookings(res.data)
    } catch (err) {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await API.put(`/bookings/${id}/status`, { status })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (err) {
      setError('Failed to update booking status.')
    } finally {
      setUpdatingId(null)
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

        .status-select {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 6px;
          padding: 6px 10px;
          color: #fff;
          font-size: 12px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          outline: none;
        }
        .status-select:focus { border-color: #dc2626; }

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
        <AdminNavbar />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 4px' }}>
              Booking Management
            </h1>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
              View and manage all customer bookings
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {['All', 'Upcoming', 'Completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'All' ? `All Bookings (${bookings.length})` : `${f} (${bookings.filter(b => b.status === f.toUpperCase()).length})`}
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

          {/* Table */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, overflow: 'hidden' }}>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 120px',
              padding: '14px 20px',
              borderBottom: '1px solid #1f2937',
              background: '#0d1420',
            }}>
              {['Movie', 'Customer', 'Cinema', 'Showtime', 'Seats / Amount', 'Status'].map(h => (
                <span key={h} style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              [...Array(4)].map((_, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 120px',
                  padding: '16px 20px', borderBottom: '1px solid #1f2937', gap: 12,
                }}>
                  {[...Array(6)].map((_, j) => (
                    <div key={j} style={{ height: 16, borderRadius: 4, background: '#1f2937', width: '70%' }} />
                  ))}
                </div>
              ))
            )}

            {/* Empty */}
            {!loading && filteredBookings.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                  No {filter === 'All' ? '' : filter.toLowerCase()} bookings found.
                </p>
              </div>
            )}

            {/* Booking Rows */}
            {!loading && filteredBookings.map((booking, idx) => (
              <div key={booking.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 120px',
                padding: '16px 20px',
                alignItems: 'center',
                borderBottom: idx < filteredBookings.length - 1 ? '1px solid #1f2937' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a2332'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Movie */}
                <div>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>
                    {booking.movieTitle}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>
                    Ref: {booking.bookingReference}
                  </p>
                </div>

                {/* Customer */}
                <div>
                  <p style={{ color: '#d1d5db', fontSize: 13, margin: '0 0 2px' }}>
                    {booking.username}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>
                    {formatDate(booking.createdAt)}
                  </p>
                </div>

                {/* Cinema */}
                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                  {booking.cinema}
                </p>

                {/* Showtime */}
                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                  {booking.showtime}
                </p>

                {/* Seats / Amount */}
                <div>
                  <p style={{ color: '#d1d5db', fontSize: 13, margin: '0 0 2px' }}>
                    {booking.seats}
                  </p>
                  <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 700, margin: 0 }}>
                    ₱{booking.totalAmount?.toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: booking.status === 'UPCOMING' ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)',
                    color: booking.status === 'UPCOMING' ? '#60a5fa' : '#4ade80',
                    width: 'fit-content',
                  }}>
                    {booking.status === 'UPCOMING' ? 'Upcoming' : 'Completed'}
                  </span>
                  <select
                    className="status-select"
                    value={booking.status}
                    disabled={updatingId === booking.id}
                    onChange={e => updateStatus(booking.id, e.target.value)}
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredBookings.length > 0 && (
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 16, textAlign: 'right' }}>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} total
            </p>
          )}
        </main>
      </div>
    </>
  )
}