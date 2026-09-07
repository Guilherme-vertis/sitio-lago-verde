import BookingsAdmin from '@/app/components/BookingsAdmin'
import Link from 'next/link'

export default function AdminReservasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header com voltar */}
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-green-700">📋 Gerenciar Reservas</h1>
        </div>

        <BookingsAdmin />
      </div>
    </main>
  )
}
