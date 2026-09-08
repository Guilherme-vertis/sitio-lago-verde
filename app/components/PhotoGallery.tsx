'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Photo {
  id: number
  house_id: number
  photo_url: string
  file_path: string
  uploaded_at: string
}

interface PhotoGalleryProps {
  houseId: number
  onPhotoDeleted: () => void
}

export default function PhotoGallery({ houseId, onPhotoDeleted }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    loadPhotos()
  }, [houseId])

  async function loadPhotos() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('house_photos')
        .select('*')
        .eq('house_id', houseId)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (err) {
      console.error('Erro ao carregar fotos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deletePhoto(photo: Photo) {
    if (!window.confirm('Tem certeza que deseja deletar esta foto?')) return

    setDeleting(photo.id)

    try {
      // Deletar arquivo do Storage
      const { error: storageError } = await supabase.storage
        .from('house-photos')
        .remove([photo.file_path])

      if (storageError) throw storageError

      // Deletar registro do banco
      const { error: dbError } = await supabase
        .from('house_photos')
        .delete()
        .eq('id', photo.id)

      if (dbError) throw dbError

      // Atualizar lista
      setPhotos(photos.filter((p) => p.id !== photo.id))
      onPhotoDeleted()
    } catch (err) {
      console.error('Erro ao deletar foto:', err)
      alert('Erro ao deletar foto')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando fotos...</p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">📭 Nenhuma foto carregada ainda</p>
        <p className="text-gray-400 text-sm mt-2">Use o formulário acima para adicionar fotos</p>
      </div>
    )
  }

  return (
    <div>
      {/* Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          ✅ {photos.length} foto{photos.length > 1 ? 's' : ''} carregada{photos.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
            {/* Imagem */}
            <div className="aspect-square relative bg-gray-200">
              <img
                src={photo.photo_url}
                alt="House photo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay ao passar o mouse */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => window.open(photo.photo_url, '_blank')}
                className="px-3 py-2 bg-white text-gray-900 rounded font-medium text-sm hover:bg-gray-100 transition"
              >
                👁️ Ver
              </button>
              <button
                onClick={() => deletePhoto(photo)}
                disabled={deleting === photo.id}
                className="px-3 py-2 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-700 transition disabled:bg-gray-400"
              >
                {deleting === photo.id ? '...' : '🗑️ Deletar'}
              </button>
            </div>

            {/* Info da foto */}
            <div className="p-3 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-500">
                📅 {new Date(photo.uploaded_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
