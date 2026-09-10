'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
        window.MercadoPago.setLocale('pt-BR')

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

        if (!response.ok) throw new Error('Erro ao criar preferência')

        const { preferenceId } = await response.json()

        // Renderizar Wallet Brick
        await window.MercadoPago.Bricks().create('wallet', {
          initialization: {
            preferenceId: preferenceId,
          },
          onSubmit: async (formData: any) => {
            console.log('Pagamento iniciado:', formData)
          },
          onError: (error: any) => {
            console.error('Erro no Brick:', error)
            setError('Erro ao processar pagamento')
          },
          onReady: () => {
            setLoading(false)
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
