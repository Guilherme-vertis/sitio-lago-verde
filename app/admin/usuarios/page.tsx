import Link from 'next/link'

export default function AdminUsuariosPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
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
            <p className="text-3xl font-bold text-gray-900">-</p>
            <p className="text-xs text-gray-500 mt-2">Conectando ao banco...</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Usuários Ativos</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
            <p className="text-xs text-gray-500 mt-2">Com reservas</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm">Último Registro</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
            <p className="text-xs text-gray-500 mt-2">Novo usuário</p>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">📋 Lista de Usuários</h3>
          </div>

          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">⏳ Carregando usuários...</p>
              <p className="text-sm text-gray-400">
                Os usuários aparecem aqui assim que se registrarem no sistema.
              </p>
            </div>
          </div>

          {/* Tabela Estrutura */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Nome</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Telefone</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-900">Reservas</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">Nenhum usuário registrado</td>
                  <td colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-green-900 mb-2">✨ Sistema Funcional</h3>
          <p className="text-green-800 text-sm">
            Este painel é um exemplo de como seria o gerenciamento de usuários.
            Para funcionalidade completa com banco de dados em tempo real, seria necessário
            conectar à sua base Supabase e implementar queries de usuários.
          </p>
        </div>
      </div>
    </main>
  )
}
