import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { getAllMovies } from '../api/movies'

// Cinema data per movie
const CINEMA_DATA = {
  default: [
    {
      name: 'SM City Cebu',
      address: 'North Reclamation Area, Cebu City',
      distance: '2.5 km',
      showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'],
    },
    {
      name: 'SM Seaside Cebu',
      address: 'South Road Properties, Cebu City',
      distance: '5.8 km',
      showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM'],
    },
    {
      name: 'Ayala Center Cebu',
      address: 'Cebu Business Park, Cebu City',
      distance: '3.2 km',
      showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'],
    },
    {
      name: 'Robinsons Galleria Cebu',
      address: 'Gen. Maxilom Ave, Cebu City',
      distance: '4.1 km',
      showtimes: ['11:30 AM', '3:00 PM', '6:30 PM', '9:45 PM'],
    },
  ],
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const res = await getAllMovies()
      setMovies(res.data)
    } catch (err) {
      setError('Failed to load movies.')
    } finally {
      setLoading(false)
    }
  }

  const filteredMovies = movies.filter(m =>
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.genre?.toLowerCase().includes(search.toLowerCase()) ||
    m.actors?.toLowerCase().includes(search.toLowerCase())
  )

  const handleShowtimeClick = (movie, cinema, time) => {
    setSelectedMovie(null)
    navigate(`/seat-selection?movie=${encodeURIComponent(movie.title)}&cinema=${encodeURIComponent(cinema.name)}&time=${encodeURIComponent(time)}&movieId=${movie.id}&poster=${encodeURIComponent(movie.posterUrl || '')}`)
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

        .movie-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.25s, transform 0.2s;
          display: flex;
          flex-direction: column;
        }
        .movie-card:hover {
          border-color: #dc2626;
          transform: translateY(-4px);
        }
        .movie-card:hover .mc-poster-img {
          transform: scale(1.05);
        }
        .mc-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .view-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          width: 100%;
          transition: background 0.15s;
        }
        .view-btn:hover { background: #b91c1c; }

        .genre-badge {
          background: #1f2937;
          color: #d1d5db;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: Inter, sans-serif;
          font-weight: 500;
        }

        .showtime-btn {
          background: transparent;
          border: 1px solid #374151;
          color: #ffffff;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .showtime-btn:hover {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton {
          animation: pulse 1.8s ease-in-out infinite;
          background: #1f2937;
          border-radius: 6px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-card { animation: fadeIn 0.2s ease; }

        @media (max-width: 768px) {
          .movies-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .movies-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ width: '100vw', minHeight: '100vh', background: '#000', fontFamily: 'Inter, sans-serif' }}>
        <Navbar onSearch={setSearch} />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 6px' }}>
              Now Showing
            </h1>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
              Book your tickets for the latest movies
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: 10, padding: '14px 20px', marginBottom: 36,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="movies-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24,
            }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: '#111827', border: '1px solid #1f2937',
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  <div className="skeleton" style={{ height: 360, width: '100%' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 20, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    <div className="skeleton" style={{ height: 40, width: '100%' }} />
                    <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMovies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <svg width="48" height="48" fill="none" stroke="#374151" strokeWidth="1.5"
                viewBox="0 0 24 24" style={{ margin: '0 auto 16px', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>
                {search ? 'No movies found.' : 'No movies available yet. Check back soon!'}
              </p>
            </div>
          )}

          {/* Movie Grid */}
          {!loading && filteredMovies.length > 0 && (
            <div className="movies-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24,
            }}>
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onViewDetails={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* View Details Modal */}
      {selectedMovie && (
        <div style={styles.overlay} onClick={() => setSelectedMovie(null)}>
          <div className="modal-card" style={styles.modal} onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button onClick={() => setSelectedMovie(null)} style={styles.closeBtn}>
              <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Movie title */}
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
              {selectedMovie.title}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 20px' }}>
              {selectedMovie.genre} • {selectedMovie.duration}
            </p>

            {/* Movie info row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {selectedMovie.posterUrl && (
                <img src={selectedMovie.posterUrl} alt={selectedMovie.title}
                  style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
                    {selectedMovie.rating}/10
                  </span>
                </div>
                <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px' }}>
                  {selectedMovie.description}
                </p>
                {selectedMovie.actors && (
                  <>
                    <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 4px' }}>Starring</p>
                    <p style={{ color: '#d1d5db', fontSize: 13, margin: 0 }}>{selectedMovie.actors}</p>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#1f2937', marginBottom: 20 }} />

            {/* Available Cinemas */}
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
              Available Cinemas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CINEMA_DATA.default.map((cinema) => (
                <div key={cinema.name} style={styles.cinemaCard}>
                  <div style={{ marginBottom: 12 }}>
                    <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>
                      {cinema.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="12" height="12" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span style={{ color: '#6b7280', fontSize: 12 }}>
                        {cinema.address} • {cinema.distance}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: 12, margin: '0 0 10px', fontWeight: 500 }}>
                    Showtimes
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {cinema.showtimes.map((time) => (
                      <button
                        key={time}
                        className="showtime-btn"
                        onClick={() => handleShowtimeClick(selectedMovie, cinema, time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function MovieCard({ movie, onViewDetails }) {
  return (
    <div className="movie-card">
      {/* Poster */}
      <div style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
        {movie.posterUrl ? (
          <img className="mc-poster-img" src={movie.posterUrl} alt={movie.title} loading="lazy" />
        ) : (
          <div style={{
            width: '100%', height: '100%', background: '#1f2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="40" height="40" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}
        {/* Rating badge */}
        {movie.rating && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.8)', borderRadius: 20,
            padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{movie.rating}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{
          color: '#fff', fontSize: 18, fontWeight: 700, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {movie.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {movie.genre && <span className="genre-badge">{movie.genre}</span>}
          {movie.duration && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9ca3af', fontSize: 13 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {movie.duration}
            </span>
          )}
        </div>

        {movie.description && (
          <p style={{
            color: '#9ca3af', fontSize: 13, lineHeight: 1.6, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {movie.description}
          </p>
        )}

        {movie.actors && (
          <div>
            <p style={{ color: '#6b7280', fontSize: 11, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Starring
            </p>
            <p style={{
              color: '#d1d5db', fontSize: 13, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {movie.actors}
            </p>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button className="view-btn" onClick={onViewDetails}>View Details</button>
        </div>
      </div>
    </div>
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
    maxWidth: 580,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16, right: 16,
    background: 'none', border: 'none',
    cursor: 'pointer', padding: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 6,
  },
  cinemaCard: {
    background: '#0d1420',
    border: '1px solid #1f2937',
    borderRadius: 10,
    padding: 16,
  },
}