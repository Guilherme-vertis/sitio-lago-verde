import { getHouses } from '@/lib/supabase'
import BookingForm from '../components/BookingForm'
import Link from 'next/link'

export default async function ReservasPage() {
  const houses = await getHouses()

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header com Login */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-green-700 mb-2">🏞️ Sítio Lago Verde</h1>
            <p className="text-lg text-gray-600">Reserve sua casa de sonho agora!</p>
          </div>
          <Link
            href="/cliente/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            👤 Minha Conta
          </Link>
        </div>

        {/* Grid de casas com formulário de reserva */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {houses.map((house) => (
            <div key={house.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-green-500">
              {/* Info da casa */}
              <div className="p-6 border-b-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{house.name}</h2>

                {house.description && (
                  <p className="text-gray-600 text-sm mb-3">{house.description}</p>
                )}

                {house.location && (
                  <p className="text-gray-500 text-sm mb-4">📍 {house.location}</p>
                )}

                {/* Info rápida */}
                <div className="bg-green-50 p-3 rounded-lg space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Preço:</span>
                    <span className="text-lg font-bold text-green-700">
                      R$ {house.price_per_night.toFixed(2)}/noite
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Capacidade:</span>
                    <span className="text-gray-700">
                      👥 Até {house.capacity} pessoa{house.capacity > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Amenidades */}
                {house.amenities && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-2">✨ Comodidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof house.amenities === 'string'
                        ? JSON.parse(house.amenities)
                        : house.amenities
                      ).slice(0, 4).map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Formulário de reserva */}
              <div className="p-6">
                <BookingForm house={house} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p className="text-sm">
            💳 Pagamento 100% seguro com Mercado Pago | 📧 Confirmação por email
          </p>
        </div>
      </div>
    </main>
  )
}
