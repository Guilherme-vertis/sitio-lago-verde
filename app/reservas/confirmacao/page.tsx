'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) return

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', parseInt(bookingId))
          .single()

        if (error) throw error
        setBooking(data)
      } catch (err) {
        console.error('Erro ao carregar reserva:', err)
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [bookingId])

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reserva não encontrada</h1>
          <Link href="/reservas" className="text-green-600 hover:underline">
            ← Voltar para reservas
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Ícone de sucesso */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h1>
            <p className="text-gray-600">Sua reserva foi confirmada com sucesso</p>
          </div>

          {/* Detalhes da reserva */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número da Reserva</p>
                <p className="text-lg font-bold text-gray-900">#{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-700">✅ Confirmada</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(booking.check_in).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(booking.check_out).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Hóspede</p>
                <p className="text-lg font-semibold text-gray-900">{booking.guest_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{booking.guest_email}</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-green-700">
                R$ {(booking.total_price || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Próximos passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-bold text-blue-900 mb-3">📋 Próximos passos:</h2>
            <ul className="space-y-2 text-sm text-blue-900">
              <li>✅ Um email de confirmação foi enviado para {booking.guest_email}</li>
              <li>✅ Você pode consultar suas reservas em "Minha Conta"</li>
              <li>✅ Entre em contato conosco com dúvidas</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4">
            <Link
              href="/cliente/dashboard"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-center transition"
            >
              Ver Minhas Reservas
            </Link>
            <Link
              href="/reservas"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg text-center transition"
            >
              Fazer Nova Reserva
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
