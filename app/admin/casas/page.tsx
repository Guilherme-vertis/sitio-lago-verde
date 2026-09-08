'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { House, getHouses, createHouse, updateHouse, deleteHouse } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import CalendarView from '@/app/components/CalendarView'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AdminCasasPage() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedHouseForCalendar, setSelectedHouseForCalendar] = useState<House | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price_per_night: 0,
    capacity: 1,
    active: true,
    photo_url: '',
  })

  useEffect(() => {
    loadHouses()
  }, [])

  async function loadHouses() {
    setLoading(true)
    const data = await getHouses()
    setHouses(data || [])
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name: '',
      description: '',
      location: '',
      price_per_night: 0,
      capacity: 1,
      active: true,
      photo_url: '',
    })
    setEditingId(null)
    setShowForm(false)
    setPhotoPreview(null)
  }

  function editHouse(house: House) {
    setFormData({
      name: house.name,
      description: house.description || '',
      location: house.location || '',
      price_per_night: house.price_per_night,
      capacity: house.capacity,
      active: house.active,
      photo_url: house.photo_url || '',
    })
    setPhotoPreview(house.photo_url || null)
    setEditingId(house.id)
    setShowForm(true)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingPhoto(true)

      // Gerar nome único para a foto
      const fileName = `house-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('house-photos')
        .upload(fileName, file)

      if (error) throw error

      // Obter URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from('house-photos').getPublicUrl(fileName)

      setFormData({ ...formData, photo_url: publicUrl })
      setPhotoPreview(publicUrl)
    } catch (error) {
      alert('Erro ao upload da foto: ' + (error as any).message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function saveHouse() {
    if (!formData.name.trim()) {
      alert('Nome da casa é obrigatório!')
      return
    }

    try {
      if (editingId) {
        await updateHouse(editingId, formData as any)
        alert('Casa atualizada com sucesso!')
      } else {
        await createHouse(formData as any)
        alert('Casa criada com sucesso!')
      }
      resetForm()
      loadHouses()
    } catch (error) {
      alert('Erro ao salvar casa: ' + (error as any).message)
    }
  }

  async function removeHouse(id: number) {
    if (!confirm('Tem certeza que quer deletar essa casa?')) return

    try {
      await deleteHouse(id)
      alert('Casa deletada com sucesso!')
      loadHouses()
    } catch (error) {
      alert('Erro ao deletar: ' + (error as any).message)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="text-center p-8">Carregando casas...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">🏠 Gerenciar Casas</h1>
          </div>
        </div>

        {/* Botão adicionar */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            ➕ Adicionar Nova Casa
          </button>
        )}

        {/* FORMULÁRIO */}
        {showForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {editingId ? '✏️ Editar Casa' : '➕ Criar Nova Casa'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coluna esquerda - Formulário */}
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Nome da Casa *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Casa do Lago"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Preço por Noite (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })
                    }
                    placeholder="250.00"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Capacidade */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Capacidade (pessoas) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Lado norte da pousada"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a casa..."
                    rows={3}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Ativa */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    id="active"
                    className="w-4 h-4"
                  />
                  <label htmlFor="active" className="text-sm font-semibold text-gray-900">
                    Casa ativa
                  </label>
                </div>
              </div>

              {/* Coluna direita - Upload de foto */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  📷 Foto da Casa
                </label>

                {photoPreview ? (
                  <div className="mb-4">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                    <span className="text-4xl">📸</span>
                  </div>
                )}

                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                  <span
                    className={`inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                      uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingPhoto ? '⏳ Enviando...' : '📤 Escolher Foto'}
                  </span>
                </label>

                {formData.photo_url && (
                  <p className="text-xs text-gray-500 mt-2">✅ Foto carregada com sucesso</p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={saveHouse}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                💾 Salvar
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}

        {/* LISTA DE CASAS */}
        {houses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma casa cadastrada. Crie uma! 🏠</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <div
                key={house.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Foto */}
                <div className="w-full h-40 bg-gray-100 overflow-hidden">
                  {house.photo_url ? (
                    <img
                      src={house.photo_url}
                      alt={house.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🏡
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{house.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        house.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {house.active ? '✅' : '❌'}
                    </span>
                  </div>

                  {house.description && (
                    <p className="text-sm text-gray-600 mb-3">{house.description}</p>
                  )}

                  <div className="space-y-1 text-sm text-gray-700 mb-4">
                    {house.location && <p>📍 {house.location}</p>}
                    <p>👥 {house.capacity} pessoa{house.capacity > 1 ? 's' : ''}</p>
                    <p className="font-bold text-green-600">
                      R$ {house.price_per_night.toFixed(2)}/noite
                    </p>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedHouseForCalendar(house)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded font-semibold text-sm transition-colors"
                    >
                      📅
                    </button>
                    <button
                      onClick={() => editHouse(house)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-semibold text-sm transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeHouse(house.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold text-sm transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal do Calendário */}
        {selectedHouseForCalendar && (
          <CalendarView
            house={selectedHouseForCalendar}
            onClose={() => setSelectedHouseForCalendar(null)}
          />
        )}
      </div>
    </main>
  )
}
