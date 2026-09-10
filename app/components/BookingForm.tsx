'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { House } from '@/lib/supabase'
import { getAllBookingsForHouse, Booking } from '@/lib/bookings'
import { supabase } from '@/lib/supabase'

type BookingFormProps = {
  house: House
  onSuccess?: () => void
}

export default function BookingForm({ house, onSuccess }: BookingFormProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [house.id])

  async function loadBookings() {
    const data = await getAllBookingsForHouse(house.id)
    setBookings(data)
  }

  // Calcular número de noites
  function calculateNights(): number {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calcular preço total
  function calculateTotal(): number {
    return calculateNights() * house.price_per_night
  }

  // Verificar se data está disponível
  function isDateAvailable(date: string): boolean {
    return !bookings.some(
      (booking) =>
        new Date(booking.check_in) <= new Date(date) &&
        new Date(date) < new Date(booking.check_out)
    )
  }

  // Validar reserva
  function validateBooking(): boolean {
    setError('')

    if (!checkIn || !checkOut) {
      setError('Por favor, escolha as datas de check-in e check-out')
      return false
    }

    if (!guestName.trim()) {
      setError('Por favor, digite seu nome')
      return false
    }

    if (!guestEmail.trim()) {
      setError('Por favor, digite seu email')
      return false
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out deve ser após check-in')
      return false
    }

    // Verificar disponibilidade
    let currentDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    while (currentDate < endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      if (!isDateAvailable(dateStr)) {
        setError('Uma ou mais datas não estão disponíveis')
        return false
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return true
  }

  // Fazer reserva
  async function handleBooking() {
    if (!validateBooking()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            house_id: house.id,
            check_in: checkIn,
            check_out: checkOut,
            guest_name: guestName,
            guest_email: guestEmail,
            total_price: calculateTotal(),
            status: 'pending',
          },
        ])
        .select()

      if (error) throw error

      if (!data || !data[0]) throw new Error('Erro ao criar reserva')

      const bookingId = data[0].id

      // Redirecionar imediatamente
      window.location.href = `/reservas/checkout?booking=${bookingId}`
    } catch (err) {
      setError('Erro ao fazer reserva: ' + (err as any).message)
    } finally {
      setLoading(false)
    }
  }

  // Obter data mínima (hoje)
  const today = new Date().toISOString().split('T')[0]

  // Obter datas bloqueadas para inputs
  const getDisabledDates = () => {
    const dates = new Set<string>()
    bookings.forEach((booking) => {
      let current = new Date(booking.check_in)
      const end = new Date(booking.check_out)
      while (current < end) {
        dates.add(current.toISOString().split('T')[0])
        current.setDate(current.getDate() + 1)
      }
    })
    return dates
  }

  const disabledDates = getDisabledDates()
  const nights = calculateNights()
  const total = calculateTotal()

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-300">
      <h3 className="text-xl font-bold mb-4 text-gray-800">📅 Faça sua Reserva</h3>

      {/* Mensagem de sucesso */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-600 text-green-700 rounded">
          ✅ Reserva criada com sucesso! Você receberá um email de confirmação.
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
          ❌ {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Datas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Dados do hóspede */}
        <div>
          <label className="block text-sm font-semibold mb-1">Seu Nome *</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="João Silva"
            className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Seu Email *</label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Seu Telefone</label>
          <input
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Resumo do preço */}
        {nights > 0 && (
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                {nights} noite{nights > 1 ? 's' : ''}
              </span>
              <span className="font-semibold">
                R$ {house.price_per_night.toFixed(2)}/noite
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-green-700">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Botão de reserva */}
        <button
          onClick={handleBooking}
          disabled={loading || !checkIn || !checkOut}
          className={`
            w-full py-3 rounded-lg font-bold text-white text-lg transition-all
            ${
              loading || !checkIn || !checkOut
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 cursor-pointer'
            }
          `}
        >
          {loading ? '⏳ Processando...' : '🎉 Reservar Agora'}
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center">
          * Você receberá um email de confirmação após a reserva
        </p>
      </div>
    </div>
  )
}
