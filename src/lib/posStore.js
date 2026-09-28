import { POS_TAX_RATE, PRODUCTS } from '../data/dashboardData.js'

/**
 * Frontend-only storage for point-of-sale transactions (ROOT CO.).
 *
 * Completed sales live in localStorage so receipts survive a refresh — the
 * same pattern the mock auth uses. There is no backend; swap for a real
 * orders API later.
 */

const KEY = 'inventory360.pos.transactions'
const MAX_TRANSACTIONS = 50

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* localStorage may be unavailable — transactions are optional */
  }
}

/** Build a seeded receipt, so the Sell page shows history on first run. */
function seedTransactions() {
  const now = Date.now()
  const find = (id) => PRODUCTS.find((p) => p.id === id)
  const make = (id, qty, minutesAgo, payment, customer) => {
    const product = find(id)
    if (!product) return null
    const subtotal = product.price * qty
    const tax = subtotal * POS_TAX_RATE
    return {
      time: new Date(now - minutesAgo * 60000).toISOString(),
      items: [{ id: product.id, name: product.name, qty, price: product.price }],
      subtotal,
      tax,
      total: subtotal + tax,
      payment,
      customer,
    }
  }

  return [
    make('P-0001', 2, 18, 'Card', 'Maya Chen'),
    make('P-0011', 1, 96, 'Cash'),
    make('P-0007', 1, 155, 'Card', 'Dana Weiss'),
  ]
    .filter(Boolean)
    .map((tx, i) => ({ ...tx, id: `TX-${String(i + 1).padStart(5, '0')}` }))
}

/** All persisted transactions, newest first (seeds demo history once). */
export function loadTransactions() {
  const list = read()
  if (list.length > 0) return list
  const seeded = seedTransactions()
  write(seeded)
  return seeded
}

/** Prepend a new transaction and persist. Returns the updated list. */
export function recordTransaction(transaction) {
  const next = [transaction, ...read()].slice(0, MAX_TRANSACTIONS)
  write(next)
  return next
}