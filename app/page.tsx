'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Painel de Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Casas */}
          <a href="/admin/casas" className="p-6 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-orange-900 mb-2">🏠 Gerenciar Casas</h2>
            <p className="text-orange-700">Editar casas e fotos</p>
          </a>

          {/* Card Reservas */}
          <a href="/admin/reservas" className="p-6 bg-green-50 border border-green-200 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-900 mb-2">📅 Gerenciar Reservas</h2>
            <p className="text-green-700">Visualizar e gerenciar reservas</p>
          </a>

          {/* Card Usuários */}
          <a href="/admin/usuarios" className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-purple-900 mb-2">👥 Gerenciar Usuários</h2>
            <p className="text-purple-700">Visualizar contas de clientes</p>
          </a>
        </div>
      </div>
    </main>
  )
}
