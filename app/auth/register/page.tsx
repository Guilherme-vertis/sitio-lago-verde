'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .upsert([
            {
              id: authData.user.id,
              email: formData.email,
              full_name: formData.name,
              phone: formData.phone || null,
            },
          ])

        if (userError) throw userError

        // Auto-login após signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (!signInError && signInData.session) {
          localStorage.setItem('auth_token', signInData.session.access_token)
          localStorage.setItem('user_id', authData.user.id)
          alert('Conta criada com sucesso! Redirecionando...')
          router.push('/cliente/dashboard')
        } else {
          alert('Conta criada! Por favor, faça login.')
          router.push('/auth/login')
        }
      }
    } catch (err) {
      setError((err as any).message || 'Erro ao criar conta')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</h1>
            <p className="text-gray-600">Junte-se a nós para fazer reservas</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Seu Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="João Silva"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Botão */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem conta?{' '}
              <Link href="/auth/login" className="text-gray-900 font-medium hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
