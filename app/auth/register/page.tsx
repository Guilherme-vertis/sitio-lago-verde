'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  })

  async function handleRegister() {
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Senhas não conferem')
      return
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      // Salvar dados adicionais na tabela users
      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .upsert([
            {
              id: authData.user.id,
              email: formData.email,
              name: formData.name,
              phone: formData.phone || null,
            },
          ])

        if (userError) throw userError
      }

      alert('Conta criada com sucesso! Faça login para continuar.')
      router.push('/auth/login')
    } catch (err) {
      setError((err as any).message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-t-4 border-green-500">
        <h1 className="text-3xl font-bold text-green-700 mb-2">🏡 Sítio Lago Verde</h1>
        <p className="text-gray-600 mb-6">Crie sua conta para fazer reservas</p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold mb-1">Seu Nome *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="João Silva"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold mb-1">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold mb-1">Senha *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-semibold mb-1">Confirmar Senha *</label>
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              placeholder="••••••"
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Botão */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-bold text-white text-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
            }`}
          >
            {loading ? '⏳ Criando conta...' : '✅ Criar Conta'}
          </button>

          {/* Link para login */}
          <div className="text-center text-sm text-gray-600">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
