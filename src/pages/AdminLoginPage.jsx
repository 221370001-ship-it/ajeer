import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const { login, user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (user?.authenticated) {
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/admin')
    } catch {
      // Intentionally generic error message to prevent enumeration or leaking info
      setError(t('loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Lock size={40} color="#1a6ca8" />
        </div>
        <h1>{t('adminLogin')}</h1>
        <p className="login-subtitle">Ajeer HRS Permit Management</p>

        {error && <div className="login-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} noValidate={false}>
          <div className="form-group">
            <label className="form-label">{t('username')}</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('username')}
              autoCapitalize="none"
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}
