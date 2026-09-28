import { useEffect, useState } from 'react'

/** Allowed top-level routes. Sidebar sections + the auth pages. */
const ALLOWED = new Set([
  'home',
  'sell',
  'reporting',
  'catalog',
  'inventory',
  'customers',
  'setup',
  'login',
  'register',
])

function normalize(hash) {
  const clean = hash.replace(/^#/, '').replace(/^\/+/, '').replace(/\/+$/, '')
  if (clean === '') return 'home'
  const first = clean.split('/')[0]
  return ALLOWED.has(first) ? first : 'home'
}

/**
 * Minimal hash-based router (no dependency).
 * '#/sell' -> 'sell', '#/' or '' -> 'home', unknown -> 'home'.
 */
export function useHashRoute() {
  const [route, setRoute] = useState(() => normalize(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(normalize(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}