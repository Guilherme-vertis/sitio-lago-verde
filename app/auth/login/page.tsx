'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    setError('')

    if (!email || !password) {
      setError('Preencha email e senha')
      return
    }

    setLoading(true)

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError

      // Armazenar sessão no localStorage
      if (data.session) {
        localStorage.setItem('auth_token', data.session.access_token)
        localStorage.setItem('user_id', data.user.id)
      }

      alert('Login realizado com sucesso!')
      router.push('/cliente/dashboard')
    } catch (err) {
      setError((err as any).message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-green-700 mb-2">🏡 Sítio Lago Verde</h1>
        <p className="text-gray-600 mb-6">Faça login na sua conta</p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold mb-1">Senha *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Botão */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-bold text-white text-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {loading ? '⏳ Entrando...' : '✅ Fazer Login'}
          </button>

          {/* Links */}
          <div className="text-center text-sm text-gray-600 space-y-2">
            <div>
              Não tem conta?{' '}
              <Link href="/auth/register" className="text-green-600 font-semibold hover:underline">
                Crie uma agora
              </Link>
            </div>
            <Link href="/reservas" className="text-blue-600 font-semibold hover:underline block">
              ← Voltar para reservas
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
