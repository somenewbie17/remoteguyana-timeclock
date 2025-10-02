"use client";
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed')
      return
    }
    window.location.href = '/app'
  }

  return (
    <main className="max-w-sm mx-auto pt-24">
      <div className="card">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full px-3 py-2 rounded border bg-white text-black" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full px-3 py-2 rounded border bg-white text-black" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn w-full" type="submit">Sign in</button>
        </form>
        <div className="mt-4 text-sm text-gray-500">Demo users will be created by seed script.</div>
      </div>
    </main>
  )
}
