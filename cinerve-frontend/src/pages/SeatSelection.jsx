import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getReservedSeats } from '../api/bookings'

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const PRICE_PER_SEAT = 350

export default function SeatSelection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const movie = searchParams.get('movie') || ''
  const cinema = searchParams.get('cinema') || ''
  const time = searchParams.get('time') || ''
  const movieId = searchParams.get('movieId') || ''
  const poster = searchParams.get('poster') || ''

  const [selectedSeats, setSelectedSeats] = useState([])
  const [reservedSeats, setReservedSeats] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservedSeats()
  }, [])

  const fetchReservedSeats = async () => {
    setLoading(true)
    try {
      const res = await getReservedSeats(movieId, cinema, time)
      setReservedSeats(res.data || [])
    } catch (err) {
      setReservedSeats([])
    } finally {
      setLoading(false)
    }
  }

  const getSeatId = (row, col) => `${row}${col}`

  const getSeatStatus = (row, col) => {
    const seatId = getSeatId(row, col)
    if (reservedSeats.includes(seatId)) return 'reserved'
    if (selectedSeats.includes(seatId)) return 'selected'
    return 'available'
  }

  const handleSeatClick = (row, col) => {
    const seatId = getSeatId(row, col)
    if (reservedSeats.includes(seatId)) return

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    )
  }

  const totalAmount = selectedSeats.length * PRICE_PER_SEAT

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return
    setShowConfirm(true)
  }

  const handleProceed = () => {
    setShowConfirm(false)
    navigate('/payment', {
      state: {
        movie,
        cinema,
        time,
        movieId,
        poster,
        seats: selectedSeats.join(','),
        totalAmount,
      }
    })
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

        .seat-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .seat-available {
          background: #1f2937;
          color: #9ca3af;
        }
        .seat-available:hover {
          background: #374151;
          color: #fff;
        }
        .seat-selected {
          background: #dc2626;
          color: #fff;
        }
        .seat-reserved {
          background: #374151;
          color: #4b5563;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .confirm-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: '10px 24px';
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .confirm-btn:hover:not(:disabled) { background: #b91c1c; }
        .confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ width: '100vw', minHeight: '100vh', background: '#000', fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1f2937',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>{movie}</h2>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{cinema} • {time}</p>
            </div>
          </div>
          <button
            className="confirm-btn"
            disabled={selectedSeats.length === 0}
            onClick={handleConfirm}
            style={{ padding: '10px 24px' }}
          >
            Confirm ({selectedSeats.length})
          </button>
        </div>

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
              Select Your Seats
            </h1>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
              Click on the seats you want to reserve
            </p>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 32, marginBottom: 32,
          }}>
            {[
              { label: 'Available', color: '#1f2937', textColor: '#9ca3af' },
              { label: 'Selected', color: '#dc2626', textColor: '#fff' },
              { label: 'Reserved', color: '#374151', textColor: '#4b5563' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.textColor }} />
                </div>
                <span style={{ color: '#d1d5db', fontSize: 13 }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Screen */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              height: 6, background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
              borderRadius: 4, marginBottom: 8,
            }} />
            <p style={{ color: '#6b7280', fontSize: 12, textAlign: 'center', margin: 0, letterSpacing: '2px' }}>
              SCREEN
            </p>
          </div>

          {/* Seat Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
              Loading seats...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 500, margin: '0 auto', width: 'fit-content' }}>
                {ROWS.map(row => (
                  <div key={row} style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                  }}>
                    {/* Row label */}
                    <span style={{
                      color: '#6b7280', fontSize: 13, fontWeight: 600,
                      width: 20, textAlign: 'center', flexShrink: 0,
                    }}>
                      {row}
                    </span>

                    {/* Seats */}
                    {COLS.map(col => {
                      const status = getSeatStatus(row, col)
                      return (
                        <button
                          key={col}
                          className={`seat-btn seat-${status}`}
                          onClick={() => handleSeatClick(row, col)}
                          title={`${row}${col}`}
                        >
                          {col}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Seats Panel */}
          {selectedSeats.length > 0 && (
            <div style={{
              marginTop: 32,
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: 12,
              padding: 20,
            }}>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 8px' }}>Selected Seats:</p>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: 0 }}>
                {selectedSeats.sort().join(', ')}
              </p>
              <div style={{
                marginTop: 12, paddingTop: 12,
                borderTop: '1px solid #1f2937',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} × ₱{PRICE_PER_SEAT}
                </span>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>
                  ₱{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 4px', textAlign: 'center' }}>
              Confirm Your Selection
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 24px', textAlign: 'center' }}>
              Have you finally decided on these seats?
            </p>

            {/* Booking details card */}
            <div style={{
              background: '#0d1420', border: '1px solid #1f2937',
              borderRadius: 10, padding: 20, marginBottom: 24,
            }}>
              {[
                { label: 'Movie', value: movie },
                { label: 'Cinema', value: cinema },
                { label: 'Showtime', value: time },
                { label: 'Selected Seats', value: selectedSeats.sort().join(', ') },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', flexDirection: 'column',
                  paddingBottom: 12, marginBottom: 12,
                  borderBottom: '1px solid #1f2937',
                }}>
                  <span style={{ color: '#6b7280', fontSize: 12, marginBottom: 2 }}>{item.label}</span>
                  <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Total Amount</span>
                  <span style={{ color: '#6b7280', fontSize: 11 }}>₱{PRICE_PER_SEAT} per seat</span>
                </div>
                <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>
                  ₱{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: '13px', borderRadius: 8,
                  background: 'transparent', border: '1px solid #374151',
                  color: '#d1d5db', fontSize: 14, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                }}
              >
                No, Go Back
              </button>
              <button
                onClick={handleProceed}
                style={{
                  flex: 1, padding: '13px', borderRadius: 8,
                  background: '#dc2626', border: 'none',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                }}
              >
                Yes, Proceed
              </button>
            </div>
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