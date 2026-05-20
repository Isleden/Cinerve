import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Navbar({ onSearch }) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  return (
    <>
      <style>{`
        .nav-search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 14px;
          font-family: Inter, sans-serif;
        }
        .nav-search-input::placeholder { color: #6b7280; }
        .nav-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          flex-shrink: 0;
          padding: 0;
        }
        .nav-icon-btn:hover { background: #1f2937; }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.inner}>

          {/* Logo */}
          <div style={styles.logoWrap} onClick={() => navigate('/dashboard')}>
            <div style={styles.logoIcon}>C</div>
            <span style={styles.logoText}>Cinerve</span>
          </div>

          {/* Search Bar */}
          <div style={styles.searchWrap}>
            <svg width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="nav-search-input"
              type="text"
              placeholder="Search movies, genres, actors..."
              value={searchValue}
              onChange={handleSearch}
            />
          </div>

          {/* Icons */}
          <div style={styles.actions}>

            {/* Settings */}
            <button className="nav-icon-btn" title="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>

            {/* History */}
            <button className="nav-icon-btn" title="Purchase History"
              onClick={() => navigate('/history')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>

            {/* Profile */}
            <button className="nav-icon-btn" title="Profile"
              onClick={() => navigate('/profile')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Logout */}
            <button
              className="nav-icon-btn"
              title="Logout"
              onClick={handleLogout}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

          </div>
        </div>
      </nav>
    </>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    background: 'rgba(0,0,0,0.95)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1f2937',
    height: '64px',
    boxSizing: 'border-box',
  },
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  logoIcon: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '18px',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    flexShrink: 0,
  },
  logoText: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '-0.3px',
  },
  searchWrap: {
    flex: 1,
    maxWidth: '480px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '8px',
    padding: '8px 14px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: 'auto',
  },
}