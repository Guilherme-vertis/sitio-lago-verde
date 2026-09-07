'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

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
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Link href="/reservas">
            <Image
              src="/logo.png"
              alt="Sítio Lago Verde"
              width={100}
              height={70}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="space-y-8">
          {/* Título */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Faça seu login</h1>
            <p className="text-gray-600">Acesse sua conta para continuar</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Botão */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {/* Links */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Não tem conta?{' '}
              <Link href="/auth/register" className="text-gray-900 font-medium hover:underline">
                Crie uma agora
              </Link>
            </p>
            <Link
              href="/reservas"
              className="inline-block text-sm text-gray-600 hover:underline"
            >
              ← Voltar para reservas
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
