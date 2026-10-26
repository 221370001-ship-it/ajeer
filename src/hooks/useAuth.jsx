import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
const AUTH_TOKEN_KEY = 'ajeer_sec_session'

// Cryptographic SHA-256 hashes of credentials (prevents plaintext exposure in source)
const EXPECTED_USER_HASH = '45eeaf2c951cecc91df81ae0b9512c6e98fb0439a35dcfde01fac0102390b605'
const EXPECTED_PASS_HASH = 'd630685dc7a5cb832dcbb9e2bed7947e06fd4f47899d0352287d9ee58c445bed'

async function hashString(value) {
  if (!value) return ''
  const buffer = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY)
      if (stored) {
        const session = JSON.parse(stored)
        if (session && session.token && session.validUntil > Date.now()) {
          setUser({ authenticated: true, role: 'admin' })
        } else {
          sessionStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_TOKEN_KEY)
          setUser(null)
        }
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const cleanUsername = (username || '').trim()
    const cleanPassword = (password || '').trim()

    const [uHash, pHash] = await Promise.all([
      hashString(cleanUsername),
      hashString(cleanPassword)
    ])

    if (uHash === EXPECTED_USER_HASH && pHash === EXPECTED_PASS_HASH) {
      const session = {
        token: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        validUntil: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }
      sessionStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(session))
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(session))
      const authUser = { authenticated: true, role: 'admin' }
      setUser(authUser)
      return authUser
    }

    throw new Error('AUTH_FAILED')
  }

  const logout = async () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
