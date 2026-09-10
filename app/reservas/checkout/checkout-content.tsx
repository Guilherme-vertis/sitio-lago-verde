'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MercadoPagoCheckout from '@/app/components/MercadoPagoCheckout'

export default function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('booking')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) {
        setError('ID de reserva inválido')
        setLoading(false)
        return
      }

      try {
        const { data, error: err } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', parseInt(bookingId))
          .single()

        if (err) throw err
        setBooking(data)
      } catch (err) {
        setError((err as any).message || 'Erro ao carregar reserva')
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

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">{error || 'Reserva não encontrada'}</p>
          <button
            onClick={() => router.push('/reservas')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            ← Voltar para Reservas
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento da Reserva</h1>
          <p className="text-gray-600">Reserva #{booking.id}</p>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna de Checkout */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Escolha a forma de pagamento</h2>

            {booking.status === 'confirmed' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h3>
                <p className="text-green-600 mb-6">Esta reserva já foi paga.</p>
                <button
                  onClick={() => router.push('/cliente/dashboard')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Ver Minhas Reservas
                </button>
              </div>
            ) : (
              <MercadoPagoCheckout
                bookingId={booking.id}
                guestName={booking.guest_name}
                guestEmail={booking.guest_email}
                amount={booking.total_price}
                houseName={`Casa ID ${booking.house_id}`}
                checkIn={booking.check_in}
                checkOut={booking.check_out}
              />
            )}
          </div>

          {/* Resumo da Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📋 Resumo</h3>

              <div className="space-y-4 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Hóspede</p>
                  <p className="font-semibold text-gray-900">{booking.guest_name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{booking.guest_email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.check_in).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.check_out).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold text-gray-900">
                    R$ {booking.total_price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-700">
                  <span>Total:</span>
                  <span>R$ {booking.total_price.toFixed(2)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <div className={`px-4 py-2 rounded-lg text-center font-semibold ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status === 'confirmed' && '✅ Confirmada'}
                  {booking.status === 'pending' && '⏳ Pendente de Pagamento'}
                  {booking.status === 'cancelled' && '❌ Cancelada'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
