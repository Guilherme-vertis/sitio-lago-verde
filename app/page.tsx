'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header com navegação */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sítio Lago Verde</h1>
          <nav className="space-x-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link href="/auth/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
              Criar Conta
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao Sítio Lago Verde</h2>
          <p className="text-xl text-gray-600 mb-8">Escolha uma opção abaixo para continuar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card Clientes - Reservar */}
          <Link href="/reservas" className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-blue-900 mb-2">🏡 Fazer Reserva</h2>
            <p className="text-blue-700">Navegue nossas casas e faça uma reserva</p>
          </Link>

          {/* Card Admin - Gerenciar */}
          <Link href="/admin" className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-purple-900 mb-2">🔧 Painel Admin</h2>
            <p className="text-purple-700">Gerenciar casas, reservas e usuários</p>
          </Link>

          {/* Card Cliente - Dashboard */}
          <Link href="/cliente/dashboard" className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-900 mb-2">👤 Minha Conta</h2>
            <p className="text-green-700">Acessar suas reservas e perfil</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
