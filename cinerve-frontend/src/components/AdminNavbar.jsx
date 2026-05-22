// src/components/AdminNavbar.jsx

import { useNavigate, useLocation } from 'react-router-dom'

export function AdminNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Logo */}
        <div style={styles.logoWrap} onClick={() => navigate('/dashboard')}>
          <div style={styles.logoIcon}>C</div>
          <span style={styles.logoText}>Cinerve</span>
          <span style={styles.adminBadge}>Admin</span>
        </div>

        {/* Nav Links */}
        <div style={styles.links}>
          <button
            style={{
              ...styles.navLink,
              background: isActive('/admin') ? '#1f2937' : 'none',
              color: isActive('/admin') ? '#fff' : '#9ca3af',
            }}
            onClick={() => navigate('/admin')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Movies
          </button>

          <button
            style={{
              ...styles.navLink,
              background: isActive('/admin/bookings') ? '#1f2937' : 'none',
              color: isActive('/admin/bookings') ? '#fff' : '#9ca3af',
            }}
            onClick={() => navigate('/admin/bookings')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Bookings
          </button>
        </div>

        {/* Right side */}
        <div style={styles.actions}>
          <button
            style={styles.dashboardBtn}
            onClick={() => navigate('/dashboard')}
          >
            View Site
          </button>
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
    gap: '24px',
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
  },
  logoText: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',
  },
  adminBadge: {
    background: '#dc2626',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '20px',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s',
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dashboardBtn: {
    background: '#1f2937',
    color: '#d1d5db',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '8px',
    transition: 'color 0.15s',
  },
}