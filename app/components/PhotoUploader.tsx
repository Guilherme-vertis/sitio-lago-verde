'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface PhotoUploaderProps {
  houseId: number
  onUploadSuccess: () => void
}

export default function PhotoUploader({ houseId, onUploadSuccess }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos de 5MB')
      return
    }

    await uploadPhoto(file)
  }

  async function uploadPhoto(file: File) {
    setUploading(true)
    setError('')
    setSuccess('')

    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const fileName = `${houseId}/${timestamp}_${file.name}`

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('house-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Obter URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from('house-photos').getPublicUrl(fileName)

      // Salvar referência no banco de dados
      const { error: dbError } = await supabase
        .from('house_photos')
        .insert([
          {
            house_id: houseId,
            photo_url: publicUrl,
            file_path: fileName,
            uploaded_at: new Date().toISOString(),
          },
        ])

      if (dbError) throw dbError

      setSuccess('Foto enviada com sucesso!')
      onUploadSuccess()

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError((err as any).message || 'Erro ao fazer upload')
      console.error('Erro:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Sucesso */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">✅ {success}</p>
        </div>
      )}

      {/* Input de arquivo */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="photo-input"
        />
        <label
          htmlFor="photo-input"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <span className="text-4xl">📸</span>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {uploading ? 'Enviando...' : 'Clique para selecionar uma foto'}
            </p>
            <p className="text-xs text-gray-500 mt-1">ou arraste uma imagem aqui</p>
            <p className="text-xs text-gray-400 mt-2">Máximo 5MB • Formatos: JPG, PNG, GIF</p>
          </div>
        </label>
      </div>

      {/* Nota */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
        💡 Dica: Use imagens de alta qualidade (mínimo 1200x800px) para melhor resultado
      </div>
    </div>
  )
}
