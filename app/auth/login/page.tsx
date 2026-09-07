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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-green-500">
          {/* Header com Logo */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="Sítio Lago Verde"
              width={120}
              height={80}
              className="object-contain mb-4"
              priority
            />
            <h1 className="text-2xl font-bold text-white">Sítio Lago Verde</h1>
            <p className="text-green-100 text-sm mt-1">Faça login em sua conta</p>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {/* Erro */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-sm">Erro ao fazer login</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Formulário */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all"
                />
              </div>

              {/* Botão */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 cursor-pointer shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? '⏳ Entrando...' : '✅ Fazer Login'}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Links */}
            <div className="space-y-3 text-center">
              <div className="text-gray-600">
                Não tem conta?{' '}
                <Link href="/auth/register" className="text-green-600 font-semibold hover:underline">
                  Crie uma agora
                </Link>
              </div>
              <Link href="/reservas" className="inline-block text-blue-600 font-semibold hover:underline">
                ← Voltar para reservas
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🛡️ Seus dados estão seguros conosco</p>
        </div>
      </div>
    </main>
  )
}
