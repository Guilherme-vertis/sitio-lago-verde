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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Card de Registro */}
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
            <p className="text-green-100 text-sm mt-1">Crie sua conta</p>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {/* Erro */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p className="font-semibold text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* Formulário */}
            <div className="space-y-3">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Seu Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="João Silva"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all text-sm"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all text-sm"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Senha *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Senha *</label>
                <input
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  placeholder="••••••"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-green-50 transition-all text-sm"
                />
              </div>

              {/* Botão */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-all duration-200 mt-6 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 cursor-pointer shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? '⏳ Criando conta...' : '✅ Criar Conta'}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Link para login */}
            <div className="text-center text-sm text-gray-600">
              Já tem conta?{' '}
              <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
                Faça login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🔐 Seus dados estão 100% seguros</p>
        </div>
      </div>
    </main>
  )
}
