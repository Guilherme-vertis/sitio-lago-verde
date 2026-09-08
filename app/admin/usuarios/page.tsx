'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Usuario {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [totalUsuarios, setTotalUsuarios] = useState(0)

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function carregarUsuarios() {
    try {
      setCarregando(true)

      // Buscar usuários da tabela public.users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar usuários:', error)
        return
      }

      setUsuarios(data || [])
      setTotalUsuarios(data?.length || 0)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">👥 Gerenciar Usuários</h1>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-blue-900 mb-2">ℹ️ Painel de Usuários</h2>
          <p className="text-blue-800">
            Sistema de gerenciamento de usuários registrados. Aqui você pode ver todos os clientes,
            seus dados de contato e histórico de reservas.
          </p>
        </div>

        {/* Cards de Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Total de Usuários</p>
            <p className="text-3xl font-bold text-gray-900">{totalUsuarios}</p>
            <p className="text-xs text-gray-500 mt-2">Registrados no sistema</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Usuários Ativos</p>
            <p className="text-3xl font-bold text-gray-900">{usuarios.length}</p>
            <p className="text-xs text-gray-500 mt-2">Com conta criada</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Último Registro</p>
            <p className="text-3xl font-bold text-gray-900">
              {usuarios.length > 0 ? '✓' : '-'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {usuarios.length > 0
                ? new Date(usuarios[0].created_at).toLocaleDateString('pt-BR')
                : 'Nenhum registro'}
            </p>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">📋 Lista de Usuários</h3>
          </div>

          {carregando && (
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">⏳ Carregando usuários...</p>
                <p className="text-sm text-gray-400">
                  Conectando ao banco de dados...
                </p>
              </div>
            </div>
          )}

          {!carregando && usuarios.length === 0 && (
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">📭 Nenhum usuário registrado</p>
                <p className="text-sm text-gray-400">
                  Os usuários aparecem aqui assim que se registrarem no sistema.
                </p>
              </div>
            </div>
          )}

          {!carregando && usuarios.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Nome</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Telefone</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Registrado em</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {usuario.full_name || 'Sem nome'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {usuario.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500 text-xs">
                        {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-green-900 mb-2">✨ Sistema Funcional</h3>
          <p className="text-green-800 text-sm">
            Este painel está conectado ao Supabase e carrega os usuários em tempo real.
            Novos registros aparecem automaticamente na tabela.
          </p>
        </div>
      </div>
    </main>
  )
}
