import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Frontend-only mock authentication for the ROOT CO. prototype.
 *
 * Users and the active session live in localStorage — there is no server and
 * no real security. This exists so the login/register flow and the user-aware
 * UI can be exercised end-to-end. Swap for a real auth provider later.
 */

const USERS_KEY = 'inventory360.users'
const SESSION_KEY = 'inventory360.session'

export const DEMO_ACCOUNT = {
  id: 'demo',
  name: 'Sasha Merkel',
  email: 'sasha@inventory360.app',
  password: 'demo1234',
  role: 'Store Manager',
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/** One-time seed: make the demo account available on first run. */
function ensureDemoUser() {
  const users = readJSON(USERS_KEY, [])
  if (!Array.isArray(users) || users.length === 0) {
    writeJSON(USERS_KEY, [{ ...DEMO_ACCOUNT }])
  }
}

/** Session stores identity only — never the password. */
function toSession(account) {
  return { name: account.name, email: account.email, role: account.role }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null))

  useEffect(() => {
    ensureDemoUser()
  }, [])

  const login = (email, password) => {
    const users = readJSON(USERS_KEY, [])
    const account = users.find(
      (u) => String(u.email).toLowerCase() === String(email).trim().toLowerCase(),
    )
    if (!account) {
      return { ok: false, error: 'No account found with that email. Create one first.' }
    }
    if (account.password !== password) {
      return { ok: false, error: 'That password is not correct. Try again.' }
    }
    const session = toSession(account)
    writeJSON(SESSION_KEY, session)
    setUser(session)
    return { ok: true }
  }

  const register = ({ name, email, password }) => {
    const cleanEmail = String(email).trim().toLowerCase()
    const users = readJSON(USERS_KEY, [])
    const exists = users.some((u) => String(u.email).toLowerCase() === cleanEmail)
    if (exists) {
      return { ok: false, error: 'An account with that email already exists. Sign in instead.' }
    }
    const account = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).trim(),
      email: cleanEmail,
      password: String(password),
      role: 'Store Manager',
    }
    writeJSON(USERS_KEY, [...users, account])
    const session = toSession(account)
    writeJSON(SESSION_KEY, session)
    setUser(session)
    return { ok: true }
  }

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore storage failures */
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}