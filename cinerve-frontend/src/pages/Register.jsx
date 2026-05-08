import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', fullName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.fullName || !form.email || !form.password || !form.confirmPassword)
      return setError('All fields are required.')
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match.')
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      await register({
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
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
          height: 100% !important;
          box-sizing: border-box;
        }
        * { box-sizing: border-box; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .auth-input:focus {
          border-color: #dc2626 !important;
          outline: none;
        }
        .auth-link:hover { text-decoration: underline; }
        .submit-btn:hover:not(:disabled) { background: #b91c1c !important; }
      `}</style>

      <div style={styles.wrapper}>
        <div style={styles.bgGlow} />

        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>C</div>
            <span style={styles.logoText}>Cinerve</span>
          </div>

          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subheading}>Join Cinerve and start booking today</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Username */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrap}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  className="auth-input"
                  style={styles.input}
                  name="username"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Full Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrap}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.121 17.804A5 5 0 0112 15a5 5 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  className="auth-input"
                  style={styles.input}
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrap}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <input
                  className="auth-input"
                  style={styles.input}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"
                    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  className="auth-input"
                  style={styles.input}
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrap}>
                <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  className="auth-input"
                  style={styles.input}
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{ ...styles.submitBtn, opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <span style={styles.loadingRow}>
                  <svg style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link" style={styles.link}>Sign in here</Link>
          </p>
        </div>
      </div>
    </>
  )
}

const styles = {
  wrapper: {
    width: '100vw',
    minHeight: '100vh',
    background: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
    justifyContent: 'center',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '20px',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',
  },
  heading: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 6px',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  subheading: {
    color: '#9ca3af',
    fontSize: '14px',
    margin: '0 0 28px',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#d1d5db',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
  },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    color: '#6b7280',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '11px 14px 11px 38px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(220,38,38,0.12)',
    border: '1px solid rgba(220,38,38,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#f87171',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  submitBtn: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    marginTop: '4px',
    transition: 'background 0.15s',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 20px',
  },
  dividerLine: { flex: 1, height: '1px', background: '#1f2937' },
  dividerText: { color: '#6b7280', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
  switchText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    margin: 0,
  },
  link: {
    color: '#dc2626',
    textDecoration: 'none',
    fontWeight: '500',
  },
}