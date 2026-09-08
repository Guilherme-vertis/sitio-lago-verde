'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { House, getHouses } from '@/lib/supabase'

export default function Home() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHouses()
  }, [])

  async function loadHouses() {
    setLoading(true)
    const data = await getHouses()
    setHouses(data || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-gray-900">Sítio Lago Verde</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              🔐 Minha Conta
            </Link>
            <Link
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              ⚙️ Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Bem-vindo ao Sítio Lago Verde
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Pousada de luxo com casas aconchegantes à beira do lago
          </p>
          <Link
            href="/reservas"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            📅 Fazer uma Reserva
          </Link>
        </div>
      </div>

      {/* Casas */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Nossas Casas</h3>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando casas...</p>
          </div>
        ) : houses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma casa disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses
              .filter((h) => h.active)
              .map((house) => (
                <div
                  key={house.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Imagem placeholder */}
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-4xl">
                    🏡
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{house.name}</h4>

                    {house.description && (
                      <p className="text-sm text-gray-600 mb-4">{house.description}</p>
                    )}

                    <div className="space-y-2 mb-6 text-sm text-gray-700">
                      {house.location && <p>📍 {house.location}</p>}
                      <p>👥 Até {house.capacity} pessoa{house.capacity > 1 ? 's' : ''}</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {house.price_per_night.toFixed(2)}/noite
                      </p>
                    </div>

                    <Link
                      href="/reservas"
                      className="w-full block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Reservar
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>© 2026 Sítio Lago Verde. Todos os direitos reservados.</p>
        </div>
      </div>
    </main>
  )
}
