import { useMemo, useState } from 'react'
import {
  Banknote,
  CreditCard,
  History,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import Modal from '../dashboard/Modal.jsx'
import ProductIcon from '../products/ProductIcon.jsx'
import StockBadge from '../products/StockBadge.jsx'
import {
  CATEGORIES,
  POS_TAX_RATE,
  PRODUCTS,
  formatCurrency,
  stockStatus,
  stockTotal,
} from '../../data/dashboardData.js'
import { loadTransactions, recordTransaction } from '../../lib/posStore.js'
import cn from '../../lib/cn.js'

const PAYMENT_OPTIONS = [
  { id: 'Card', icon: CreditCard },
  { id: 'Cash', icon: Banknote },
]

const chipContainer =
  'inline-flex items-center gap-0.5 rounded-lg border border-line bg-card p-0.5 shadow-sm'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatDay(iso) {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/**
 * Point-of-sale page (frontend-only):
 * product picker → cart → checkout → persisted receipt history.
 */
export default function SellPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState('')
  const [payment, setPayment] = useState('Card')
  const [transactions, setTransactions] = useState(() => loadTransactions())
  const [receipt, setReceipt] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((product) => {
      const matchesQuery =
        !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q)
      const matchesCategory = category === 'All' || product.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const productOf = (id) => PRODUCTS.find((product) => product.id === id)
  const lineOf = (id) => cart.find((line) => line.id === id)

  const add = (id) => {
    const product = productOf(id)
    if (!product || stockStatus(product) === 'out') return
    const current = lineOf(id)?.qty ?? 0
    if (current >= stockTotal(product)) return
    setCart((lines) => {
      const existing = lines.find((line) => line.id === id)
      if (existing) {
        return lines.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line))
      }
      return [...lines, { id, qty: 1 }]
    })
  }

  const increment = (id) => {
    const product = productOf(id)
    if (!product) return
    const current = lineOf(id)?.qty ?? 0
    if (current >= stockTotal(product)) return
    setCart((lines) =>
      lines.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line)),
    )
  }

  const decrement = (id) =>
    setCart((lines) =>
      lines
        .map((line) => (line.id === id ? { ...line, qty: line.qty - 1 } : line))
        .filter((line) => line.qty > 0),
    )

  const remove = (id) => setCart((lines) => lines.filter((line) => line.id !== id))
  const clear = () => setCart([])

  const subtotal = cart.reduce((sum, line) => {
    const product = productOf(line.id)
    return sum + (product?.price ?? 0) * line.qty
  }, 0)
  const tax = subtotal * POS_TAX_RATE
  const total = subtotal + tax
  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0)

  const completeSale = () => {
    if (cart.length === 0) return
    const transaction = {
      id: `TX-${String(transactions.length + 1).padStart(5, '0')}`,
      time: new Date().toISOString(),
      items: cart.map((line) => {
        const product = productOf(line.id)
        return { id: product.id, name: product.name, qty: line.qty, price: product.price }
      }),
      subtotal,
      tax,
      total,
      payment,
      customer: customer.trim() || undefined,
    }
    setTransactions(recordTransaction(transaction))
    setReceipt(transaction)
    setCart([])
    setCustomer('')
    setPayment('Card')
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      {/* Left column — catalog + history */}
      <div className="min-w-0 space-y-5">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-text">Product Catalog</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Tap a product to add it to the sale.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  strokeWidth={2}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/60"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="w-52 rounded-lg border border-line bg-soft py-2 pl-8 pr-3 text-[13px] text-text placeholder:text-muted/50 transition focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25 sm:w-60"
                />
              </div>

              {/* Category filter */}
              <div role="group" aria-label="Category filter" className={chipContainer}>
                {['All', ...CATEGORIES].map((label) => {
                  const isActive = category === label
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setCategory(label)}
                      aria-pressed={isActive}
                      className={cn(
                        'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                        isActive ? 'bg-sidebar text-white shadow-sm' : 'text-muted hover:text-text',
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-line bg-soft/50 px-6 py-12 text-center">
              <p className="text-sm font-semibold text-text">No products match “{query}”</p>
              <p className="mt-1 text-xs text-muted">Try a different search or category.</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => {
                const status = stockStatus(product)
                const disabled = status === 'out'
                const inCart = lineOf(product.id)?.qty ?? 0
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => add(product.id)}
                    disabled={disabled}
                    title={disabled ? 'Out of stock' : `Add ${product.name} to the sale`}
                    className="group relative flex flex-col items-start gap-2.5 rounded-xl border border-line bg-soft/50 p-3 text-left transition-colors hover:border-olive/60 hover:bg-olive-light/25 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:bg-soft/50"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-card text-muted ring-1 ring-line transition-colors group-hover:text-olive">
                      <ProductIcon name={product.icon} size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-text">
                        {product.name}
                      </span>
                      <span className="mt-0.5 block text-[12px] font-medium text-muted">
                        {formatCurrency(product.price)}
                      </span>
                    </span>

                    {inCart > 0 ? (
                      <span className="absolute right-2 top-2 grid h-6 min-w-6 place-items-center rounded-full bg-olive px-1.5 text-[11px] font-bold text-white">
                        {inCart}
                      </span>
                    ) : (
                      !disabled && (
                        <span
                          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-sidebar text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        >
                          <Plus size={13} strokeWidth={2.4} />
                        </span>
                      )
                    )}

                    <StockBadge status={status} count={stockTotal(product)} />
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* Recent transactions */}
        <section className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-olive-light/70 text-olive">
                <History size={15} strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 className="text-[15px] font-bold tracking-tight text-text">Recent Transactions</h2>
            </div>
            <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-line">
              {transactions.length} total
            </span>
          </div>

          {transactions.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-line bg-soft/50 px-4 py-8 text-center text-xs text-muted">
              No sales recorded yet — complete your first order above.
            </p>
          ) : (
            <ul className="no-scrollbar mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {transactions.slice(0, 8).map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-soft/50 px-3.5 py-2.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card text-muted ring-1 ring-line">
                    <Receipt size={16} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-text">{transaction.id}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {formatDay(transaction.time)} · {formatTime(transaction.time)} ·{' '}
                      {transaction.items.reduce((sum, item) => sum + item.qty, 0)} items
                      {transaction.payment && <> · {transaction.payment}</>}
                      {transaction.customer && <> · {transaction.customer}</>}
                    </p>
                  </div>
                  <span className="shrink-0 text-[13px] font-semibold text-text">
                    {formatCurrency(transaction.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Right column — cart */}
      <aside className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-olive-light/70 text-olive">
              <ShoppingCart size={15} strokeWidth={2} aria-hidden="true" />
            </span>
            <h2 className="text-[15px] font-bold tracking-tight text-text">Current Sale</h2>
          </div>
          <div className="flex items-center gap-2">
            {itemCount > 0 && (
              <span className="rounded-full bg-sidebar px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
            <button
              type="button"
              onClick={clear}
              disabled={cart.length === 0}
              className="text-[11px] font-medium text-muted transition-colors hover:text-[#B3261E] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-soft text-muted ring-1 ring-line">
              <ShoppingCart size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-text">Your sale is empty</p>
            <p className="mt-1 text-xs text-muted">Select products to start a sale.</p>
          </div>
        ) : (
          <ul className="no-scrollbar max-h-[300px] divide-y divide-line/70 overflow-y-auto px-5">
            {cart.map((line) => {
              const product = productOf(line.id)
              if (!product) return null
              const status = stockStatus(product)
              return (
                <li key={line.id} className="flex items-center gap-3 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft text-muted ring-1 ring-line">
                    <ProductIcon name={product.icon} size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-text">{product.name}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted">
                      {formatCurrency(product.price)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => decrement(line.id)}
                      aria-label={`Remove one ${product.name}`}
                      className="grid h-7 w-7 place-items-center rounded-md border border-line text-muted transition-colors hover:border-olive hover:text-olive"
                    >
                      <Minus size={13} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-[13px] font-semibold text-text">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(line.id)}
                      disabled={status === 'out' || line.qty >= stockTotal(product)}
                      aria-label={`Add one ${product.name}`}
                      className="grid h-7 w-7 place-items-center rounded-md border border-line text-muted transition-colors hover:border-olive hover:text-olive disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={13} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`Remove ${product.name} from the sale`}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted/60 transition-colors hover:bg-[#FBEFED] hover:text-[#9A2B22]"
                  >
                    <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {/* Checkout */}
        <div className="border-t border-line/70 px-5 py-4">
          <label
            htmlFor="pos-customer"
            className="mb-1.5 block text-xs font-medium text-muted"
          >
            Customer (optional)
          </label>
          <input
            id="pos-customer"
            type="text"
            value={customer}
            onChange={(event) => setCustomer(event.target.value)}
            placeholder="e.g. Maya Chen"
            autoComplete="off"
            className="w-full rounded-lg border border-line bg-soft px-3.5 py-2 text-[13px] text-text placeholder:text-muted/50 transition focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
          />

          <p className="mb-1.5 mt-4 block text-xs font-medium text-muted">Payment method</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_OPTIONS.map(({ id, icon: Icon }) => {
              const isActive = payment === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayment(id)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12.5px] font-semibold transition-colors',
                    isActive
                      ? 'border-olive bg-olive-light/40 text-sidebar'
                      : 'border-line bg-soft text-muted hover:border-[#C5C7BA] hover:text-text',
                  )}
                >
                  <Icon size={14} strokeWidth={2} aria-hidden="true" />
                  {id}
                </button>
              )
            })}
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-line/70 pt-3 text-[13px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-text">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Sales Tax (8.25%)</dt>
              <dd className="font-medium text-text">{formatCurrency(tax)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-2">
              <dt className="text-sm font-semibold text-text">Total</dt>
              <dd className="text-[17px] font-bold leading-none tracking-tight text-text">
                {formatCurrency(total)}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={completeSale}
            disabled={cart.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-olive py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-olive/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Receipt size={15} strokeWidth={2} aria-hidden="true" />
            Complete Sale · {formatCurrency(total)}
          </button>
        </div>
      </aside>

      {/* Receipt confirmation */}
      {receipt && (
        <Modal open onClose={() => setReceipt(null)} title="Sale Complete">
          <div className="rounded-xl border border-line bg-soft/60 p-4 text-center">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
              Receipt {receipt.id}
            </p>
            <p className="mt-1.5 text-[26px] font-bold leading-none tracking-tight text-text">
              {formatCurrency(receipt.total)}
            </p>
            <p className="mt-1.5 text-[11.5px] text-muted">
              {formatDay(receipt.time)} · {formatTime(receipt.time)} · {receipt.payment}
              {receipt.customer && <> · {receipt.customer}</>}
            </p>
          </div>

          <ul className="no-scrollbar mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
            {receipt.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-soft/50 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-text">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {item.qty} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-text">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-1.5 rounded-xl border border-line px-4 py-3 text-[13px]">
            <Row label="Subtotal" value={formatCurrency(receipt.subtotal)} />
            <Row label="Sales Tax" value={formatCurrency(receipt.tax)} />
            <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-1.5">
              <dt className="font-semibold text-text">Total</dt>
              <dd className="font-bold text-text">{formatCurrency(receipt.total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => setReceipt(null)}
            className="mt-5 w-full rounded-xl bg-sidebar py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            New Sale
          </button>
        </Modal>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  )
}