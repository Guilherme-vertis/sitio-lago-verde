import { supabase } from './supabase'

export type Booking = {
  id: number
  house_id: number
  guest_name: string | null
  guest_email: string | null
  check_in: string
  check_out: string
  total_price: number | null
  status: string
  payment_status: string | null
  admin_confirmed: boolean
  created_at: string
  updated_at: string
}

// Buscar reservas de uma casa em um período
export async function getBookingsForHouse(houseId: number, startDate: string, endDate: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('house_id', houseId)
    .or(`check_in.lte.${endDate},check_out.gte.${startDate}`)
    .order('check_in', { ascending: true })

  if (error) {
    console.error('Erro ao buscar reservas:', error)
    return []
  }

  return data || []
}

// Criar bloqueio (reserva com status blocked)
export async function blockDate(houseId: number, checkIn: string, checkOut: string, reason?: string) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        house_id: houseId,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: reason || 'Bloqueado',
        status: 'blocked',
      },
    ])
    .select()

  if (error) {
    console.error('Erro ao bloquear data:', error)
    throw error
  }

  return data?.[0]
}

// Deletar bloqueio
export async function unblockDate(bookingId: number) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)

  if (error) {
    console.error('Erro ao desbloquear:', error)
    throw error
  }
}

// Verificar se uma data está disponível
export async function isDateAvailable(houseId: number, date: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('house_id', houseId)
    .lte('check_in', date)
    .gte('check_out', date)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao verificar disponibilidade:', error)
  }

  return !data
}

// Obter todas as reservas de uma casa
export async function getAllBookingsForHouse(houseId: number): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('house_id', houseId)
    .order('check_in', { ascending: true })

  if (error) {
    console.error('Erro ao buscar reservas:', error)
    return []
  }

  return data || []
}
