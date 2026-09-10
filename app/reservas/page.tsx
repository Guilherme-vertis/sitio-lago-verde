import { getHouses } from '@/lib/supabase'
import BookingForm from '../components/BookingForm'
import ReservasHeader from '../components/ReservasHeader'
import Link from 'next/link'

// Força sempre buscar dados frescos do Supabase
export const dynamic = 'force-dynamic'

export default async function ReservasPage() {
  const houses = await getHouses()

  return (
    <main className="min-h-screen bg-white">
      <ReservasHeader />

      {/* Hero Section - Clean */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Bem-vindo ao Sítio Lago Verde
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Encontre a casa perfeita para sua próxima estadia. Conforto, natureza e tranquilidade em um único lugar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Seção de Casas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Nossas Casas</h2>

          {/* Grid de casas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.map((house) => (
              <div
                key={house.id}
                className="group cursor-pointer"
              >
                {/* Imagem */}
                <div className="h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center text-6xl hover:bg-gray-300 transition-colors">
                  🏡
                </div>

                {/* Conteúdo */}
                <div>
                  {/* Nome e Localização */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{house.name}</h3>
                    {house.location && (
                      <p className="text-sm text-gray-500">{house.location}</p>
                    )}
                  </div>

                  {/* Descrição */}
                  {house.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{house.description}</p>
                  )}

                  {/* Informações principais */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {house.price_per_night.toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500">por noite</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Até {house.capacity} {house.capacity > 1 ? 'hóspedes' : 'hóspede'}
                      </p>
                    </div>
                  </div>

                  {/* Amenidades */}
                  {house.amenities && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {(typeof house.amenities === 'string'
                          ? JSON.parse(house.amenities)
                          : house.amenities
                        ).slice(0, 3).map((amenity: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formulário de reserva */}
                  <BookingForm house={house} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-12 border-t border-gray-200 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Pagamento Seguro</p>
              <p className="text-sm text-gray-600">Processado com segurança via Mercado Pago</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Confirmação Instantânea</p>
              <p className="text-sm text-gray-600">Receba seu código de confirmação por email</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Suporte Disponível</p>
              <p className="text-sm text-gray-600">Estamos aqui para ajudar sua reserva</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
