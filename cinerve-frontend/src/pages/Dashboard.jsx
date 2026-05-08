import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { getAllMovies } from '../api/movies'

export default function Dashboard() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          padding: 2px 8px;
          border-radius: 4px;
          font-family: Inter, sans-serif;
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

        @media (max-width: 640px) {
          .movies-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .dash-title { font-size: 22px !important; }
        }
      `}</style>

      <div style={{ width: '100vw', minHeight: '100vh', background: '#000', fontFamily: 'Inter, sans-serif' }}>

        <Navbar />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 className="dash-title" style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 6px' }}>
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
              <svg width="18" height="18" fill="none" stroke="#dc2626" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="movies-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 24,
            }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: '#111827', border: '1px solid #1f2937',
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  <div className="skeleton" style={{ aspectRatio: '2/3', width: '100%' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 16, width: '80%' }} />
                    <div className="skeleton" style={{ height: 12, width: '50%' }} />
                    <div className="skeleton" style={{ height: 36, width: '100%' }} />
                    <div className="skeleton" style={{ height: 36, width: '100%', borderRadius: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && movies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <svg width="48" height="48" fill="none" stroke="#374151" strokeWidth="1.5"
                viewBox="0 0 24 24" style={{ margin: '0 auto 16px', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>
                No movies available yet. Check back soon!
              </p>
            </div>
          )}

          {/* Movie Grid */}
          {!loading && movies.length > 0 && (
            <div className="movies-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 24,
            }}>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

        </main>
      </div>
    </>
  )
}

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      {/* Poster */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
        {movie.posterUrl ? (
          <img
            className="mc-poster-img"
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
          />
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
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        }} />
        {/* Rating badge */}
        {movie.rating && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.8)', borderRadius: 20,
            padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{movie.rating}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{
          color: '#fff', fontSize: 16, fontWeight: 600, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {movie.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {movie.genre && <span className="genre-badge">{movie.genre}</span>}
          {movie.duration && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9ca3af', fontSize: 12 }}>
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {movie.duration}
            </span>
          )}
        </div>

        {movie.description && (
          <p style={{
            color: '#9ca3af', fontSize: 12, lineHeight: 1.6, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {movie.description}
          </p>
        )}

        {movie.actors && (
          <div style={{ marginTop: 'auto' }}>
            <p style={{ color: '#6b7280', fontSize: 11, margin: '0 0 2px' }}>Starring</p>
            <p style={{
              color: '#d1d5db', fontSize: 12, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {movie.actors}
            </p>
          </div>
        )}

        <button className="view-btn">View Details</button>
      </div>
    </div>
  )
}