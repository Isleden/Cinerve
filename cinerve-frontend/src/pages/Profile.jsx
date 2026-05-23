import { useState, useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { getProfile, updateProfile, changePassword, uploadPhoto } from '../api/user'

export default function Profile() {
  const username = localStorage.getItem('username') || ''
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({ fullName: '', email: '', username: '', photoUrl: '' })
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Edit profile state — added username
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', username: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  // Change password state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Photo upload state
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoadingProfile(true)
    try {
      const res = await getProfile(username)
      setProfile(res.data)
      // Pre-fill form including username
      setProfileForm({
        fullName: res.data.fullName || '',
        email: res.data.email || '',
        username: res.data.username || '',
      })
    } catch (err) {
      console.error('Failed to load profile', err)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    setProfileError('')
    setProfileSuccess('')
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profileForm.fullName && !profileForm.email && !profileForm.username)
      return setProfileError('Please fill in at least one field.')

    setProfileLoading(true)
    try {
      const res = await updateProfile(username, profileForm)
      setProfile(res.data)
      // Update localStorage if username changed
      if (profileForm.username && profileForm.username !== username) {
        localStorage.setItem('username', profileForm.username)
      }
      setProfileSuccess('Profile updated successfully!')
      setProfileError('')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword)
      return setPasswordError('All fields are required.')
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return setPasswordError('New passwords do not match.')
    if (passwordForm.newPassword.length < 6)
      return setPasswordError('New password must be at least 6 characters.')

    setPasswordLoading(true)
    try {
      await changePassword(username, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordSuccess('Password changed successfully!')
      setPasswordError('')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/'))
      return setPhotoError('Please select an image file.')
    if (file.size > 5 * 1024 * 1024)
      return setPhotoError('Image must be less than 5MB.')

    setPhotoLoading(true)
    setPhotoError('')
    try {
      const res = await uploadPhoto(username, file)
      setProfile({ ...profile, photoUrl: res.data.photoUrl })
    } catch (err) {
      setPhotoError(err.response?.data?.message || 'Failed to upload photo.')
    } finally {
      setPhotoLoading(false)
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

        .profile-input {
          width: 100%;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 11px 14px;
          color: #ffffff;
          font-size: 14px;
          font-family: Inter, sans-serif;
          outline: none;
          transition: border-color 0.15s;
        }
        .profile-input:focus { border-color: #dc2626; }
        .profile-input::placeholder { color: #6b7280; }

        .save-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 24px;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .save-btn:hover:not(:disabled) { background: #b91c1c; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .photo-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        .photo-wrap:hover .photo-overlay { opacity: 1; }
      `}</style>

      <div style={{ width: '100vw', minHeight: '100vh', background: '#000', fontFamily: 'Inter, sans-serif' }}>
        <Navbar />

        <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>

          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 32px' }}>
            My Profile
          </h1>

          {loadingProfile ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>Loading...</div>
          ) : (
            <>
              {/* ── Photo Section ── */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Profile Photo</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div className="photo-wrap" style={{ position: 'relative', flexShrink: 0 }}
                    onClick={() => fileInputRef.current.click()}>
                    {profile.photoUrl ? (
                      <img src={profile.photoUrl} alt="Profile"
                        style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1f2937' }} />
                    ) : (
                      <div style={{
                        width: 90, height: 90, borderRadius: '50%',
                        background: '#1f2937', border: '3px solid #374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="36" height="36" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="photo-overlay">
                      {photoLoading ? (
                        <svg style={{ width: 20, height: 20, animation: 'spin 0.8s linear infinite' }}
                          viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div>
                    <p style={{ color: '#d1d5db', fontSize: 14, margin: '0 0 4px' }}>
                      Click the photo to upload a new one
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>
                      JPG, PNG or GIF — max 5MB
                    </p>
                    {photoError && (
                      <p style={{ color: '#f87171', fontSize: 12, margin: '8px 0 0' }}>{photoError}</p>
                    )}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handlePhotoChange} />
              </div>

              {/* ── Edit Profile ── */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Edit Profile</h2>
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Username — now editable */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Username</label>
                    <input className="profile-input" name="username"
                      placeholder="Enter new username"
                      value={profileForm.username} onChange={handleProfileChange} />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input className="profile-input" name="fullName"
                      placeholder="Enter your full name"
                      value={profileForm.fullName} onChange={handleProfileChange} />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email</label>
                    <input className="profile-input" name="email" type="email"
                      placeholder="Enter your email"
                      value={profileForm.email} onChange={handleProfileChange} />
                  </div>

                  {profileError && <div style={styles.errorBox}>{profileError}</div>}
                  {profileSuccess && <div style={styles.successBox}>{profileSuccess}</div>}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="save-btn" disabled={profileLoading}>
                      {profileLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Change Password ── */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Change Password</h2>
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Current Password</label>
                    <input className="profile-input" name="currentPassword" type="password"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>New Password</label>
                    <input className="profile-input" name="newPassword" type="password"
                      placeholder="Enter new password"
                      value={passwordForm.newPassword} onChange={handlePasswordChange} />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input className="profile-input" name="confirmPassword" type="password"
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                  </div>

                  {passwordError && <div style={styles.errorBox}>{passwordError}</div>}
                  {passwordSuccess && <div style={styles.successBox}>{passwordSuccess}</div>}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="save-btn" disabled={passwordLoading}>
                      {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

const styles = {
  card: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: 28,
    marginBottom: 24,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 20px',
    fontFamily: 'Inter, sans-serif',
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
  errorBox: {
    background: 'rgba(220,38,38,0.1)',
    border: '1px solid rgba(220,38,38,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f87171',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
  },
  successBox: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#86efac',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
  },
}