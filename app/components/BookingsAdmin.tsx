'use client'

import { useState, useEffect } from 'react'
import { House, getHouses } from '@/lib/supabase'
import { Booking } from '@/lib/bookings'
import { supabase } from '@/lib/supabase'

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    houseId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      // Buscar casas
      const housesData = await getHouses()
      setHouses(housesData)

      // Buscar todas as reservas
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('check_in', { ascending: false })

      if (error) {
        console.error('Erro ao buscar reservas:', error)
        return
      }

      setBookings(data || [])
    } finally {
      setLoading(false)
    }
  }

  // Atualizar status da reserva
  async function updateBookingStatus(bookingId: number, newStatus: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      alert(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'} com sucesso!`)
      loadData()
    } catch (err) {
      alert('Erro ao atualizar: ' + (err as any).message)
    }
  }

  // Deletar reserva
  async function deleteBooking(bookingId: number) {
    if (!confirm('Tem certeza que quer deletar esta reserva?')) return

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error

      alert('Reserva deletada!')
      loadData()
    } catch (err) {
      alert('Erro ao deletar: ' + (err as any).message)
    }
  }

  // Criar reserva manualmente
  async function handleCreateBooking() {
    if (!formData.houseId || !formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert('Check-out deve ser após check-in')
      return
    }

    try {
      // Calcular preço total
      const house = houses.find((h) => h.id === parseInt(formData.houseId))
      if (!house) {
        alert('Casa não encontrada')
        return
      }

      const nights = Math.ceil(
        (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      const totalPrice = nights * house.price_per_night

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            house_id: parseInt(formData.houseId),
            guest_name: formData.guestName,
            guest_email: formData.guestEmail,
            guest_phone: formData.guestPhone || null,
            check_in: formData.checkIn,
            check_out: formData.checkOut,
            total_price: totalPrice,
            status: 'pending',
          },
        ])

      if (error) throw error

      alert('Reserva criada com sucesso!')
      setFormData({
        houseId: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
      })
      setShowForm(false)
      loadData()
    } catch (err) {
      alert('Erro ao criar reserva: ' + (err as any).message)
    }
  }

  // Filtrar reservas
  let filteredBookings = bookings

  if (selectedHouseId) {
    filteredBookings = filteredBookings.filter((b) => b.house_id === selectedHouseId)
  }

  if (filterStatus !== 'all') {
    filteredBookings = filteredBookings.filter((b) => b.status === filterStatus)
  }

  // Buscar nome da casa
  function getHouseName(houseId: number): string {
    return houses.find((h) => h.id === houseId)?.name || `Casa ${houseId}`
  }

  // Status color
  function getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return '✅ Confirmada'
      case 'pending':
        return '⏳ Pendente'
      case 'cancelled':
        return '❌ Cancelada'
      default:
        return status
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-green-700">📋 Painel de Reservas</h1>

      {/* Botão para criar reserva manual */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${
            showForm ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
          } text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
        >
          {showForm ? '❌ Cancelar' : '➕ Criar Reserva Manual'}
        </button>
      </div>

      {/* Formulário de criar reserva */}
      {showForm && (
        <div className="bg-purple-50 p-6 rounded-lg shadow-md mb-6 border-2 border-purple-300">
          <h3 className="text-lg font-bold mb-4 text-purple-700">📝 Criar Reserva Manual</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Casa */}
            <div>
              <label className="block text-sm font-semibold mb-1">Casa *</label>
              <select
                value={formData.houseId}
                onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
                className="w-full border-2 border-purple-300 rounded px-3 py-2 focus:outline-none focus:border-purple-600"
              >
                <option value="">Selecione uma casa</option>
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold mb-1">Nome do Hóspede *</label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="João Silva"
                className="w-full border-2 border-purple-300 rounded px-3 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">Email *</label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="email@example.com"
                className="w-full border-2 border-purple-300 rounded px-3 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold mb-1">Telefone</label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full border-2 border-purple-300 rounded px-3 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Check-in */}
            <div>
              <label className="block text-sm font-semibold mb-1">Check-in *</label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full border-2 border-purple-300 rounded px-3 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-sm font-semibold mb-1">Check-out *</label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full border-2 border-purple-300 rounded px-3 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <button
            onClick={handleCreateBooking}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            ✅ Criar Reserva
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por casa */}
          <div>
            <label className="block text-sm font-semibold mb-2">Filtrar por Casa:</label>
            <select
              value={selectedHouseId || ''}
              onChange={(e) => setSelectedHouseId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            >
              <option value="">Todas as casas</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por status */}
          <div>
            <label className="block text-sm font-semibold mb-2">Filtrar por Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
            >
              <option value="all">Todas</option>
              <option value="pending">⏳ Pendentes</option>
              <option value="confirmed">✅ Confirmadas</option>
              <option value="cancelled">❌ Canceladas</option>
              <option value="blocked">🔒 Bloqueadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total de Reservas</p>
          <p className="text-2xl font-bold text-blue-700">{bookings.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-700">
            {bookings.filter((b) => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Confirmadas</p>
          <p className="text-2xl font-bold text-green-700">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Receita</p>
          <p className="text-2xl font-bold text-purple-700">
            R$ {bookings
              .filter((b) => b.status === 'confirmed')
              .reduce((sum, b) => sum + (b.total_price || 0), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de reservas */}
      {loading ? (
        <div className="text-center py-8">Carregando reservas...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Nenhuma reserva encontrada 📭</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">🏠 Casa</th>
                <th className="px-4 py-3 text-left font-semibold">👤 Hóspede</th>
                <th className="px-4 py-3 text-left font-semibold">📅 Check-in</th>
                <th className="px-4 py-3 text-left font-semibold">📅 Check-out</th>
                <th className="px-4 py-3 text-right font-semibold">💰 Total</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {getHouseName(booking.house_id)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-800">{booking.guest_name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.guest_email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(booking.check_in).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(booking.check_out).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">
                    R$ {(booking.total_price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 font-semibold"
                        >
                          ✅ Confirmar
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 font-semibold"
                        >
                          ❌ Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 font-semibold"
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
