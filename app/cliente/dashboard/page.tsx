'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { House } from '@/lib/supabase'
import { Booking } from '@/lib/bookings'
import Link from 'next/link'

export default function ClientDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      // Verificar se tem token
      const token = localStorage.getItem('auth_token')
      const userId = localStorage.getItem('user_id')

      if (!token || !userId) {
        router.push('/auth/login')
        return
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      setUser(userData)

      // Buscar reservas do usuário
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('guest_email', userData.email)
        .order('check_in', { ascending: false })

      if (bookingsError) throw bookingsError

      setBookings(bookingsData || [])

      // Buscar casas
      const { data: housesData, error: housesError } = await supabase
        .from('houses')
        .select('*')

      if (housesError) throw housesError

      setHouses(housesData || [])
    } catch (err) {
      console.error('Erro:', err)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_id')
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  function getHouseName(houseId: number): string {
    return houses.find((h) => h.id === houseId)?.name || `Casa ${houseId}`
  }

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

  async function handleLogout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
    router.push('/auth/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">👋 Bem-vindo, {user?.name}!</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            🚪 Sair
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total de Reservas</p>
            <p className="text-3xl font-bold text-blue-700">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Reservas Confirmadas</p>
            <p className="text-3xl font-bold text-green-700">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Gasto Total</p>
            <p className="text-3xl font-bold text-yellow-700">
              R$ {bookings
                .filter((b) => b.status === 'confirmed')
                .reduce((sum, b) => sum + (b.total_price || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botão para nova reserva */}
        <div className="mb-8">
          <Link
            href="/reservas"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
          >
            ➕ Fazer Nova Reserva
          </Link>
        </div>

        {/* Histórico de reservas */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Minhas Reservas</h2>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Você ainda não tem reservas 😔</p>
                <Link href="/reservas" className="text-green-600 font-semibold hover:underline">
                  Fazer sua primeira reserva
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">🏠 Casa</th>
                    <th className="px-4 py-3 text-left font-semibold">📅 Check-in</th>
                    <th className="px-4 py-3 text-left font-semibold">📅 Check-out</th>
                    <th className="px-4 py-3 text-right font-semibold">💰 Total</th>
                    <th className="px-4 py-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {getHouseName(booking.house_id)}
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
                        <span
                          className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
