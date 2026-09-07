import { getHouses } from '@/lib/supabase'
import BookingForm from '../components/BookingForm'
import Link from 'next/link'
import Image from 'next/image'

export default async function ReservasPage() {
  const houses = await getHouses()

  return (
    <main className="min-h-screen bg-white">
      {/* Header com Logo */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Sítio Lago Verde"
              width={100}
              height={70}
              className="object-contain"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-green-700">Sítio Lago Verde</h1>
              <p className="text-xs md:text-sm text-gray-500">Pousada Premium</p>
            </div>
          </div>
          <Link
            href="/cliente/dashboard"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-semibold shadow-lg transition-all hover:shadow-xl"
          >
            👤 Minha Conta
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Sítio Lago Verde
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            Reserve sua casa de sonho em um paraíso natural
          </p>
          <p className="text-base md:text-lg text-gray-500 mb-8">
            Conforto, tranquilidade e beleza em perfeita harmonia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Seção de Filtros/Info */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Nossas Casas</h3>
          <p className="text-gray-600">Escolha a casa perfeita para sua estadia</p>
        </div>

        {/* Grid de casas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {houses.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-green-500"
            >
              {/* Imagem placeholder */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl">🏡</div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Nome da casa */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{house.name}</h2>

                {/* Localização */}
                {house.location && (
                  <p className="text-sm text-gray-500 mb-3">📍 {house.location}</p>
                )}

                {/* Descrição */}
                {house.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{house.description}</p>
                )}

                {/* Info rápida */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg space-y-3 mb-4 border border-green-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Preço/noite:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {house.price_per_night.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Capacidade:</span>
                    <span className="text-gray-700 font-medium">
                      👥 Até {house.capacity} {house.capacity > 1 ? 'pessoa' : 'pessoa'}s
                    </span>
                  </div>
                </div>

                {/* Amenidades */}
                {house.amenities && (
                  <div className="mb-5">
                    <p className="font-semibold text-sm text-gray-700 mb-2">✨ Comodidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof house.amenities === 'string'
                        ? JSON.parse(house.amenities)
                        : house.amenities
                      ).slice(0, 3).map((amenity: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulário de reserva */}
                <div className="border-t pt-4">
                  <BookingForm house={house} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-2xl mb-2">🛡️</p>
              <p className="text-gray-700 font-semibold mb-1">Pagamento Seguro</p>
              <p className="text-sm text-gray-500">Com Mercado Pago</p>
            </div>
            <div>
              <p className="text-2xl mb-2">📧</p>
              <p className="text-gray-700 font-semibold mb-1">Confirmação</p>
              <p className="text-sm text-gray-500">Por email instantaneamente</p>
            </div>
            <div>
              <p className="text-2xl mb-2">⭐</p>
              <p className="text-gray-700 font-semibold mb-1">Qualidade</p>
              <p className="text-sm text-gray-500">100% satisfação garantida</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
