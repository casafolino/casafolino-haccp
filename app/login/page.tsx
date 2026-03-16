'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Per ora login semplice — lo collegheremo a Supabase dopo
    if (email === 'antonio@casafolino.com' && password === 'casafolino2026') {
      router.push('/dashboard')
    } else {
      setError('Email o password non corretti')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-semibold text-[#2D4A2D] mb-2">
            🫒 CasaFolino OS
          </h1>
          <p className="text-sm text-[#6B6560]">
            Produzione artigianale. Controllo industriale.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="antonio@casafolino.com"
              required
              className="w-full h-12 px-4 rounded-xl border border-[#E8E0D5] bg-white text-[#1A1A1A] placeholder:text-[#6B6560] focus:outline-none focus:border-[#2D4A2D] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-12 px-4 rounded-xl border border-[#E8E0D5] bg-white text-[#1A1A1A] focus:outline-none focus:border-[#2D4A2D] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-[#B53B2A] bg-[#FCECEA] px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#2D4A2D] text-white rounded-xl font-medium text-base hover:bg-[#3D6B3D] transition-colors disabled:opacity-50"
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

        <p className="text-center text-xs text-[#6B6560] mt-8">
          HACCP Manager · CasaFolino OS v1.0
        </p>
      </div>
    </div>
  )
}