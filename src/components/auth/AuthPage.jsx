import { useState } from 'react'
import { Boxes, Check, Eye, EyeOff, LogIn, ShieldCheck, UserPlus } from 'lucide-react'
import { DEMO_ACCOUNT, useAuth } from '../../lib/auth.jsx'
import cn from '../../lib/cn.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputBase =
  'w-full rounded-lg border border-line bg-soft px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 transition focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25'

const FEATURES = [
  'Live sales across every outlet',
  'Stock alerts and smart transfers',
  'Daily, weekly and monthly reports',
]

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-text">{label}</label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[12px] font-medium text-[#B3261E]">
          {error}
        </p>
      )}
    </div>
  )
}

export default function AuthPage({ intent = 'login' }) {
  const { login, register } = useAuth()
  const isRegister = intent === 'register'

  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState({ password: false, confirm: false })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }))
    setFieldErrors((f) => ({ ...f, [key]: undefined }))
    setFormError('')
  }

  const togglePw = (key) => () => setShowPw((s) => ({ ...s, [key]: !s[key] }))

  const validate = () => {
    const errors = {}
    const email = values.email.trim()
    if (isRegister && values.name.trim().length < 2) {
      errors.name = 'Please enter your full name.'
    }
    if (!email) {
      errors.email = 'Email is required.'
    } else if (!EMAIL_RE.test(email)) {
      errors.email = 'Enter a valid email address.'
    }
    if (!values.password) {
      errors.password = 'Password is required.'
    } else if (isRegister && values.password.length < 6) {
      errors.password = 'Use at least 6 characters.'
    }
    if (isRegister) {
      if (!values.confirm) errors.confirm = 'Please confirm your password.'
      else if (values.confirm !== values.password) errors.confirm = 'Passwords do not match.'
    }
    return errors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setSubmitting(true)
    setFormError('')
    const result = isRegister
      ? register({ name: values.name, email: values.email, password: values.password })
      : login(values.email, values.password)
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    window.location.hash = '#/home'
  }

  const fillDemo = () => {
    setValues((v) => ({ ...v, email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password }))
    setFieldErrors({})
    setFormError('')
  }

  const passwordInput = (key, placeholder) => (
    <div className="relative">
      <input
        id={key}
        type={showPw[key] ? 'text' : 'password'}
        value={values[key]}
        onChange={set(key)}
        placeholder={placeholder}
        autoComplete={key === 'password' ? (isRegister ? 'new-password' : 'current-password') : 'off'}
        aria-invalid={Boolean(fieldErrors[key])}
        className={cn(inputBase, 'pr-10')}
      />
      <button
        type="button"
        onClick={togglePw(key)}
        aria-label={showPw[key] ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted/70 transition-colors hover:text-text"
      >
        {showPw[key] ? <EyeOff size={16} strokeWidth={2} aria-hidden="true" /> : <Eye size={16} strokeWidth={2} aria-hidden="true" />}
      </button>
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-bg px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] shadow-pop ring-1 ring-line lg:grid-cols-2">
        {/* Brand panel — dark, echoes the app sidebar */}
        <div className="flex flex-col justify-between bg-sidebar p-8 text-white sm:p-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-sidebar-deep ring-1 ring-white/10">
                <Boxes size={17} className="text-olive-light" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <span className="text-[12px] font-bold uppercase tracking-[0.16em]">
                ROOT CO.
              </span>
            </div>

            <h1 className="mt-10 text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">
              Every store. Every sale.
              <span className="text-olive-light"> One clear view.</span>
            </h1>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#A3A49B]">
              Sales, stock and transfers from all your outlets in a single daily snapshot — so you
              always know what's selling and what's running low.
            </p>

            <ul className="mt-8 space-y-2.5">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-[13px] text-[#D8D9CF]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-olive/25 text-olive-light">
                    <Check size={12} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 flex items-center gap-2 text-[12px] text-[#86887f]">
            <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
            Frontend demo — accounts are stored locally on this device.
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-card p-8 sm:p-10">
          <div className="mx-auto max-w-sm">
            <div className="flex items-center gap-2 text-olive">
              {isRegister ? (
                <UserPlus size={20} strokeWidth={2} aria-hidden="true" />
              ) : (
                <LogIn size={20} strokeWidth={2} aria-hidden="true" />
              )}
              <h2 className="text-[22px] font-bold tracking-tight text-text">
                {isRegister ? 'Create your account' : 'Welcome back'}
              </h2>
            </div>
            <p className="mt-1.5 text-[13px] text-muted">
              {isRegister
                ? 'Set up a profile to manage your stores.'
                : 'Sign in to see today\'s snapshot of your stores.'}
            </p>

            {formError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-[#F0C7C3] bg-[#FBEFED] px-3.5 py-2.5 text-[13px] font-medium text-[#9A2B22]"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {isRegister && (
                <Field label="Full name" error={fieldErrors.name}>
                  <input
                    id="name"
                    type="text"
                    value={values.name}
                    onChange={set('name')}
                    placeholder="Jordan Reyes"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    className={inputBase}
                  />
                </Field>
              )}

              <Field label="Email" error={fieldErrors.email}>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={inputBase}
                />
              </Field>

              <Field label="Password" error={fieldErrors.password}>
                {passwordInput('password', isRegister ? 'At least 6 characters' : 'Your password')}
              </Field>

              {isRegister && (
                <Field label="Confirm password" error={fieldErrors.confirm}>
                  {passwordInput('confirm', 'Repeat your password')}
                </Field>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-olive/90 focus-visible:ring-2 focus-visible:ring-olive/40 disabled:opacity-60"
              >
                {isRegister ? (
                  <>
                    <UserPlus size={16} strokeWidth={2} aria-hidden="true" /> Create account
                  </>
                ) : (
                  <>
                    <LogIn size={16} strokeWidth={2} aria-hidden="true" /> Sign in
                  </>
                )}
              </button>
            </form>

            {!isRegister && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-line bg-soft px-3.5 py-2.5">
                <p className="text-[12px] leading-snug text-muted">
                  Try the demo:
                  <span className="block font-medium text-text">{DEMO_ACCOUNT.email}</span>
                </p>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="shrink-0 rounded-md border border-line bg-card px-2.5 py-1.5 text-[12px] font-semibold text-olive transition hover:bg-olive-light/60"
                >
                  Autofill
                </button>
              </div>
            )}

            <p className="mt-6 text-center text-[13px] text-muted">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <a href="#/login" className="font-semibold text-olive hover:underline">
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  New to ROOT CO.?{' '}
                  <a href="#/register" className="font-semibold text-olive hover:underline">
                    Create an account
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}