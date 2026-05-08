import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllMovies, addMovie, updateMovie, deleteMovie } from '../api/movies'
import { Navbar } from '../components/Navbar'

const EMPTY_FORM = {
  title: '',
  genre: '',
  rating: '',
  duration: '',
  posterUrl: '',
  description: '',
  actors: '',
}

export default function Admin() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null) // null = add, object = edit
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const openAddModal = () => {
    setEditingMovie(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  const openEditModal = (movie) => {
    setEditingMovie(movie)
    setForm({
      title: movie.title || '',
      genre: movie.genre || '',
      rating: movie.rating || '',
      duration: movie.duration || '',
      posterUrl: movie.posterUrl || '',
      description: movie.description || '',
      actors: movie.actors || '',
    })
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMovie(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.genre || !form.duration || !form.description)
      return setFormError('Title, genre, duration, and description are required.')

    setFormLoading(true)
    try {
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : null,
      }
      if (editingMovie) {
        await updateMovie(editingMovie.id, payload)
      } else {
        await addMovie(payload)
      }
      await fetchMovies()
      closeModal()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteMovie(deleteTarget.id)
      await fetchMovies()
      setDeleteTarget(null)
    } catch (err) {
      setError('Failed to delete movie.')
      setDeleteTarget(null)
    } finally {
      setDeleteLoading(false)
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

        .admin-table-row:hover { background: #1a2332; }

        .action-btn {
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .edit-btn { background: #1f2937; color: #d1d5db; }
        .edit-btn:hover { background: #374151; }
        .delete-btn { background: rgba(220,38,38,0.15); color: #f87171; }
        .delete-btn:hover { background: rgba(220,38,38,0.3); }

        .modal-input {
          width: 100%;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 10px 14px;
          color: #ffffff;
          fontSize: 14px;
          font-family: Inter, sans-serif;
          outline: none;
          transition: border-color 0.15s;
        }
        .modal-input:focus { border-color: #dc2626; }
        .modal-input::placeholder { color: #6b7280; }

        .primary-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 20px;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .primary-btn:hover:not(:disabled) { background: #b91c1c; }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .secondary-btn {
          background: #1f2937;
          color: #d1d5db;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 11px 20px;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .secondary-btn:hover { background: #374151; }

        .add-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s;
        }
        .add-btn:hover { background: #b91c1c; }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-card { animation: fadeIn 0.15s ease; }
      `}</style>

      <div style={{ width: '100vw', minHeight: '100vh', background: '#000', fontFamily: 'Inter, sans-serif' }}>

        <Navbar />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 4px' }}>
                Movie Management
              </h1>
              <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
                Add, edit, or remove movies from the platform
              </p>
            </div>
            <button className="add-btn" onClick={openAddModal}>
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Movie
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 8, padding: '12px 16px', color: '#f87171',
              fontSize: 13, marginBottom: 24,
            }}>
              {error}
            </div>
          )}

          {/* Table */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, overflow: 'hidden' }}>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
              padding: '14px 20px',
              borderBottom: '1px solid #1f2937',
              background: '#0d1420',
            }}>
              {['Title', 'Genre', 'Rating', 'Duration', 'Actions'].map((h) => (
                <span key={h} style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Table Body */}
            {loading ? (
              // Skeleton rows
              [...Array(4)].map((_, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                  padding: '16px 20px', borderBottom: '1px solid #1f2937',
                  gap: 12,
                }}>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} style={{
                      height: 16, borderRadius: 4, background: '#1f2937',
                      animation: 'pulse 1.8s ease-in-out infinite',
                      width: j === 4 ? 80 : '70%',
                    }} />
                  ))}
                </div>
              ))
            ) : movies.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <svg width="40" height="40" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px', display: 'block' }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>No movies yet. Click <strong style={{ color: '#dc2626' }}>Add Movie</strong> to get started.</p>
              </div>
            ) : (
              movies.map((movie, idx) => (
                <div
                  key={movie.id}
                  className="admin-table-row"
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                    padding: '16px 20px', alignItems: 'center',
                    borderBottom: idx < movies.length - 1 ? '1px solid #1f2937' : 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Title + Poster */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title}
                        style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 36, height: 50, background: '#1f2937', borderRadius: 4, flexShrink: 0 }} />
                    )}
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {movie.title}
                    </span>
                  </div>

                  {/* Genre */}
                  <span style={{
                    display: 'inline-block', background: '#1f2937', color: '#d1d5db',
                    fontSize: 11, padding: '3px 8px', borderRadius: 4, width: 'fit-content',
                  }}>
                    {movie.genre}
                  </span>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ color: '#d1d5db', fontSize: 13 }}>{movie.rating ?? '—'}</span>
                  </div>

                  {/* Duration */}
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>{movie.duration}</span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="action-btn edit-btn" onClick={() => openEditModal(movie)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => setDeleteTarget(movie)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Movie count */}
          {!loading && movies.length > 0 && (
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 16, textAlign: 'right' }}>
              {movies.length} movie{movies.length !== 1 ? 's' : ''} total
            </p>
          )}
        </main>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showModal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div className="modal-card" style={styles.modal} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Title + Genre row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Title <span style={{ color: '#dc2626' }}>*</span></label>
                  <input className="modal-input" name="title" placeholder="Movie title"
                    value={form.title} onChange={handleFormChange} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Genre <span style={{ color: '#dc2626' }}>*</span></label>
                  <input className="modal-input" name="genre" placeholder="e.g. Action"
                    value={form.genre} onChange={handleFormChange} />
                </div>
              </div>

              {/* Rating + Duration row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Rating</label>
                  <input className="modal-input" name="rating" type="number" step="0.1" min="0" max="10"
                    placeholder="e.g. 8.5" value={form.rating} onChange={handleFormChange} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Duration <span style={{ color: '#dc2626' }}>*</span></label>
                  <input className="modal-input" name="duration" placeholder="e.g. 2h 15m"
                    value={form.duration} onChange={handleFormChange} />
                </div>
              </div>

              {/* Poster URL */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Poster URL</label>
                <input className="modal-input" name="posterUrl" placeholder="https://..."
                  value={form.posterUrl} onChange={handleFormChange} />
              </div>

              {/* Description */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Description <span style={{ color: '#dc2626' }}>*</span></label>
                <textarea className="modal-input" name="description" placeholder="Brief movie description..."
                  value={form.description} onChange={handleFormChange}
                  rows={3} style={{ resize: 'vertical' }} />
              </div>

              {/* Actors */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Actors</label>
                <input className="modal-input" name="actors" placeholder="e.g. John Doe, Jane Smith"
                  value={form.actors} onChange={handleFormChange} />
              </div>

              {/* Form Error */}
              {formError && (
                <div style={{
                  background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13,
                }}>
                  {formError}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={formLoading}>
                  {formLoading ? (editingMovie ? 'Saving...' : 'Adding...') : (editingMovie ? 'Save Changes' : 'Add Movie')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div style={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" style={{ ...styles.modal, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(220,38,38,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <svg width="24" height="24" fill="none" stroke="#f87171" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>
                Delete Movie
              </h3>
              <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong style={{ color: '#fff' }}>{deleteTarget.title}</strong>? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button
                  className="primary-btn"
                  style={{ flex: 1, background: '#dc2626' }}
                  disabled={deleteLoading}
                  onClick={handleDeleteConfirm}
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
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
    background: 'rgba(0,0,0,0.7)',
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
    maxWidth: 560,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#d1d5db',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
  },
}