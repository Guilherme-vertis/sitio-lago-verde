'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface MercadoPagoCheckoutProps {
  bookingId: number
  guestName: string
  guestEmail: string
  amount: number
  houseName: string
  checkIn: string
  checkOut: string
}

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function MercadoPagoCheckout({
  bookingId,
  guestName,
  guestEmail,
  amount,
  houseName,
  checkIn,
  checkOut,
}: MercadoPagoCheckoutProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  // Polling para verificar se pagamento foi aprovado
  async function checkPaymentStatus() {
    try {
      const { data, error: err } = await supabase
        .from('bookings')
        .select('status')
        .eq('id', bookingId)
        .single()

      if (!err && data?.status === 'paid') {
        // Pagamento foi aprovado! Redirecionar
        if (pollInterval) clearInterval(pollInterval)
        router.replace(`/reservas/confirmacao?booking=${bookingId}`)
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err)
    }
  }

  useEffect(() => {
    // Carregar script do Mercado Pago
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true

    script.onload = async () => {
      const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY

      if (!window.MercadoPago || !publicKey) {
        setError('Erro ao carregar Mercado Pago')
        setLoading(false)
        return
      }

      try {
        // Inicializar Mercado Pago com a chave pública
        const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' })

        // Criar preferência de pagamento
        const response = await fetch('/api/mercado-pago/create-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            guestName,
            guestEmail,
            amount,
            houseName,
            checkIn,
            checkOut,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erro ao criar preferência')
        }

        const data = await response.json()
        const { preferenceId } = data

        if (!preferenceId) {
          console.error('PreferenceId não retornado:', data)
          throw new Error('ID de preferência inválido')
        }

        console.log('PreferenceId recebido:', preferenceId)

        // Renderizar Wallet Brick com instância
        const bricksBuilder = mp.bricks()

        await bricksBuilder.create('wallet', 'wallet_container', {
          initialization: {
            preferenceId: preferenceId,
          },
          onReady: () => {
            console.log('Wallet Brick ready')
            setLoading(false)

            // Iniciar polling para verificar se pagamento foi aprovado
            const interval = setInterval(() => {
              checkPaymentStatus()
            }, 2000) // Verificar a cada 2 segundos

            setPollInterval(interval)
          },
          onSubmit: async (formData: any) => {
            console.log('Pagamento iniciado:', formData)
          },
          onError: (error: any) => {
            console.error('Erro no Brick:', error)
            setError('Erro ao processar pagamento')
          },
        })
      } catch (err) {
        setError((err as any).message || 'Erro ao carregar checkout')
        setLoading(false)
      }
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [bookingId, guestName, guestEmail, amount, houseName, checkIn, checkOut])

  return (
    <div className="w-full">
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando opções de pagamento...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div id="wallet_container"></div>
    </div>
  )
}
