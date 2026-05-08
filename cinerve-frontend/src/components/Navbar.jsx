import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Logo */}
        <div style={styles.logoWrap} onClick={() => navigate('/dashboard')}>
          <div style={styles.logoIcon}>C</div>
          <span style={styles.logoText}>Cinerve</span>
        </div>

        {/* Icons */}
        <div style={styles.actions}>

          {/* Purchase History */}
          <button
            style={styles.iconBtn}
            title="Purchase History"
            onClick={() => navigate('/history')}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </button>

          {/* Profile */}
          <button
            style={styles.iconBtn}
            title="Profile"
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Logout */}
          <button
            style={styles.iconBtn}
            title="Log Out"
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

        </div>
      </div>
    </nav>
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
    justifyContent: 'space-between',
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
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
    flexShrink: 0,
    padding: 0,
  },
  divider: {
    width: '1px',
    height: '24px',
    background: '#374151',
    margin: '0 6px',
    flexShrink: 0,
  },
}