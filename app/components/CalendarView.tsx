'use client'

import { useState, useEffect } from 'react'
import { House } from '@/lib/supabase'
import { Booking, getAllBookingsForHouse, blockDate, unblockDate } from '@/lib/bookings'

type CalendarViewProps = {
  house: House
  onClose: () => void
}

export default function CalendarView({ house, onClose }: CalendarViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [house.id])

  async function loadBookings() {
    setLoading(true)
    const data = await getAllBookingsForHouse(house.id)
    setBookings(data)
    setLoading(false)
  }

  // Verificar se uma data está bloqueada
  function isDateBlocked(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.some(
      (booking) =>
        new Date(booking.check_in) <= date && date < new Date(booking.check_out)
    )
  }

  // Bloquear uma data
  async function handleBlockDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    const nextDayStr = nextDay.toISOString().split('T')[0]

    try {
      await blockDate(house.id, dateStr, nextDayStr, 'Bloqueado pelo admin')
      loadBookings()
      alert('Data bloqueada com sucesso!')
    } catch (error) {
      alert('Erro ao bloquear: ' + (error as any).message)
    }
  }

  // Desbloquear uma data
  async function handleUnblockDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    const booking = bookings.find(
      (b) =>
        new Date(b.check_in) <= date && date < new Date(b.check_out) &&
        b.status === 'blocked'
    )

    if (!booking) return

    try {
      await unblockDate(booking.id)
      loadBookings()
      alert('Data desbloqueada com sucesso!')
    } catch (error) {
      alert('Erro ao desbloquear: ' + (error as any).message)
    }
  }

  // Gerar dias do calendário
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const days = []
  const firstDay = getFirstDayOfMonth(currentMonth)
  const daysInMonth = getDaysInMonth(currentMonth)

  // Adicionar dias vazios do mês anterior
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Adicionar dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const monthName = currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{house.name}</h2>
            <button
              onClick={onClose}
              className="text-2xl hover:bg-green-700 w-10 h-10 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          <p className="text-green-100">R$ {house.price_per_night.toFixed(2)}/noite • Até {house.capacity} pessoa{house.capacity > 1 ? 's' : ''}</p>
        </div>

        {/* Calendário */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Carregando calendário...</div>
          ) : (
            <>
              {/* Navegação de mês */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
                >
                  ← Anterior
                </button>
                <h3 className="text-lg font-bold capitalize">{monthName}</h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
                >
                  Próximo →
                </button>
              </div>

              {/* Grid do calendário */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                    <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Dias */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square"></div>
                    }

                    const isBlocked = isDateBlocked(date)
                    const dateStr = date.toISOString().split('T')[0]
                    const isToday = dateStr === new Date().toISOString().split('T')[0]

                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          if (isBlocked) {
                            handleUnblockDate(date)
                          } else {
                            handleBlockDate(date)
                          }
                        }}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center font-semibold text-sm
                          transition-all cursor-pointer
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${isBlocked
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-200 text-gray-800 hover:bg-green-300'
                          }
                        `}
                        title={isBlocked ? 'Clique para desbloquear' : 'Clique para bloquear'}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Legenda */}
              <div className="mt-6 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-200 rounded"></div>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span>Bloqueado/Reservado</span>
                </div>
              </div>

              {/* Instruções */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
                <p className="font-semibold mb-2">💡 Como usar:</p>
                <ul className="space-y-1">
                  <li>✅ Clique em dias <span className="text-green-600 font-semibold">verdes</span> para <strong>bloquear</strong></li>
                  <li>🔴 Clique em dias <span className="text-red-600 font-semibold">vermelhos</span> para <strong>desbloquear</strong></li>
                  <li>📅 Use as setas para navegar entre meses</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
