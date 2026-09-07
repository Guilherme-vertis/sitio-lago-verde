'use client'

import { useState, useEffect } from 'react'
import { House, getHouses, createHouse, updateHouse, deleteHouse } from '@/lib/supabase'
import CalendarView from './CalendarView'

export default function HousesAdmin() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedHouseForCalendar, setSelectedHouseForCalendar] = useState<House | null>(null)

  // Valores do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price_per_night: 0,
    capacity: 1,
    active: true,
  })

  // Carregar casas ao iniciar
  useEffect(() => {
    loadHouses()
  }, [])

  async function loadHouses() {
    setLoading(true)
    const data = await getHouses()
    setHouses(data)
    setLoading(false)
  }

  // Limpar formulário
  function resetForm() {
    setFormData({
      name: '',
      description: '',
      location: '',
      price_per_night: 0,
      capacity: 1,
      active: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Editar casa existente
  function editHouse(house: House) {
    setFormData({
      name: house.name,
      description: house.description || '',
      location: house.location || '',
      price_per_night: house.price_per_night,
      capacity: house.capacity,
      active: house.active,
    })
    setEditingId(house.id)
    setShowForm(true)
  }

  // Salvar casa (criar ou atualizar)
  async function savehouse() {
    if (!formData.name.trim()) {
      alert('Nome da casa é obrigatório!')
      return
    }

    try {
      if (editingId) {
        // Atualizar
        await updateHouse(editingId, formData)
        alert('Casa atualizada com sucesso!')
      } else {
        // Criar nova
        await createHouse(formData as any)
        alert('Casa criada com sucesso!')
      }
      resetForm()
      loadHouses()
    } catch (error) {
      alert('Erro ao salvar casa: ' + (error as any).message)
    }
  }

  // Deletar casa
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
    return <div className="text-center p-8">Carregando casas...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">🏠 Gerenciar Casas - Sítio Lago Verde</h1>
        <a
          href="/admin/reservas"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          📋 Ver Reservas
        </a>
      </div>

      {/* Botão adicionar */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
        >
          ➕ Adicionar Nova Casa
        </button>
      )}

      {/* FORMULÁRIO */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-green-300">
          <h2 className="text-xl font-bold mb-4">{editingId ? '✏️ Editar Casa' : '➕ Criar Nova Casa'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold mb-1">Nome da Casa *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Casa do Lago"
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Preço por noite */}
            <div>
              <label className="block text-sm font-semibold mb-1">Preço por Noite (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) })}
                placeholder="250.00"
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Capacidade */}
            <div>
              <label className="block text-sm font-semibold mb-1">Capacidade (pessoas) *</label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-semibold mb-1">Localização</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Lado norte da pousada"
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Descrição (full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva a casa..."
                rows={3}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Ativa? */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                id="active"
                className="w-4 h-4"
              />
              <label htmlFor="active" className="font-semibold">
                Casa ativa
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={savehouse}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
            >
              💾 Salvar
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 font-semibold"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* LISTA DE CASAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
          <div
            key={house.id}
            className={`p-5 rounded-lg border-2 ${
              house.active ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            }`}
          >
            {/* Status */}
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-bold text-gray-800">{house.name}</h2>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  house.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {house.active ? '✅ Ativa' : '❌ Inativa'}
              </span>
            </div>

            {/* Informações principais */}
            <div className="space-y-2 mb-4 text-sm">
              {house.description && <p className="text-gray-600">{house.description}</p>}
              {house.location && <p className="text-gray-500">📍 {house.location}</p>}
              <p className="font-bold text-lg text-green-700">R$ {house.price_per_night.toFixed(2)}/noite</p>
              <p className="text-gray-700">👥 Até {house.capacity} pessoa{house.capacity > 1 ? 's' : ''}</p>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedHouseForCalendar(house)}
                className="flex-1 bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 font-semibold text-sm"
              >
                📅 Calendário
              </button>
              <button
                onClick={() => editHouse(house)}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 font-semibold text-sm"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => removeHouse(house.id)}
                className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-semibold text-sm"
              >
                🗑️ Deletar
              </button>
            </div>
          </div>
        ))}
      </div>

      {houses.length === 0 && (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Nenhuma casa cadastrada ainda. Crie uma! 🏠</p>
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
  )
}
