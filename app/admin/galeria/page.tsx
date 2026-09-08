import Link from 'next/link'

export default function AdminGaleriaPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">📸 Galeria de Fotos</h1>
        </div>

        {/* Content */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Painel de Gerenciamento de Fotos</h2>
          <p className="text-gray-600 mb-6">
            Sistema de upload e gerenciamento de fotos das casas integrado com Supabase Storage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Info */}
            <div className="bg-white p-6 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">📤 Upload de Fotos</h3>
              <p className="text-sm text-gray-600">
                As fotos são armazenadas no Supabase Storage e acessíveis publicamente para exibição no site.
              </p>
            </div>

            {/* Gallery Info */}
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">🖼️ Galeria</h3>
              <p className="text-sm text-gray-600">
                Visualize e delete fotos das casas. Todas as imagens são gerenciadas de forma centralizada.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              ℹ️ <strong>Nota:</strong> Este é um painel de exemplo. Para funcionar completamente, serão necessários componentes específicos de upload que podem ser adicionados posteriormente.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
