import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipagens do banco de dados
export type House = {
  id: number
  name: string
  description: string | null
  location: string | null
  price_per_night: number
  capacity: number
  amenities: string[] | null
  photos: string[] | null
  photo_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}

// Funções para trabalhar com casas
export async function getHouses(): Promise<House[]> {
  const { data, error } = await supabase
    .from('houses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar casas:', error)
    return []
  }

  return data || []
}

export async function createHouse(house: Omit<House, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('houses')
    .insert([house])
    .select()

  if (error) {
    console.error('Erro ao criar casa:', error)
    throw error
  }

  return data?.[0]
}

export async function updateHouse(id: number, updates: Partial<House>) {
  const { data, error } = await supabase
    .from('houses')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Erro ao atualizar casa:', error)
    throw error
  }

  return data?.[0]
}

export async function deleteHouse(id: number) {
  const { error } = await supabase
    .from('houses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar casa:', error)
    throw error
  }
}
