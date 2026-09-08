'use client'

import { useState, useEffect } from 'react'
import { getHouses } from '@/lib/supabase'
import PhotoUploader from '@/app/components/PhotoUploader'
import PhotoGallery from '@/app/components/PhotoGallery'
import Link from 'next/link'
import Image from 'next/image'

interface House {
  id: number
  name: string
  photos?: any[]
}

export default function AdminPhotoPage() {
  const [houses, setHouses] = useState<House[]>([])
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHouses()
  }, [])

  async function loadHouses() {
    try {
      const data = await getHouses()
      setHouses(data)
      if (data.length > 0) {
        setSelectedHouse(data[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar casas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </main>
    )
  }

  const currentHouse = houses.find((h) => h.id === selectedHouse)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Galeria de Fotos</h1>
              <p className="text-sm text-gray-500">Gerencie as fotos das casas</p>
            </div>
            <Link
              href="/reservas"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lista de casas */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Casas</h2>
              <div className="space-y-2">
                {houses.map((house) => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(house.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      selectedHouse === house.id
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {house.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentHouse ? (
              <div className="space-y-8">
                {/* Card da Casa */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{currentHouse.name}</h3>
                  <p className="text-sm text-gray-600">
                    Adicione e remova fotos desta casa. As imagens serão armazenadas na nuvem.
                  </p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">📤 Fazer Upload de Foto</h4>
                  </div>
                  <div className="p-6">
                    <PhotoUploader houseId={currentHouse.id} onUploadSuccess={loadHouses} />
                  </div>
                </div>

                {/* Gallery Section */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">🖼️ Fotos Carregadas</h4>
                  </div>
                  <div className="p-6">
                    <PhotoGallery houseId={currentHouse.id} onPhotoDeleted={loadHouses} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma casa disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
