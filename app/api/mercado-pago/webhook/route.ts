import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Validar assinatura HMAC do Mercado Pago PRIMEIRO
  const signature = request.headers.get('x-signature') || ''
  const requestId = request.headers.get('x-request-id') || ''
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

  // Parse signature: "ts=...,v1=..."
  const signatureParts: Record<string, string> = {}
  signature.split(',').forEach((part) => {
    const [key, value] = part.split('=').map((s) => s.trim())
    if (key && value) signatureParts[key] = value
  })

  const ts = signatureParts.ts
  const v1 = signatureParts.v1

  try {
    const body = await request.json()
    // Mercado Pago pode enviar data.id ou apenas id
    const dataId = body?.data?.id || body?.id

    // Validar presença de dados
    if (!ts || !v1 || !dataId || !requestId) {
      console.warn('Webhook sem campos obrigatórios:', { ts, v1, dataId, requestId })
      return NextResponse.json({ error: 'Invalid signature headers' }, { status: 400 })
    }

    // Validar secret está configurada
    if (!secret) {
      console.error('MERCADO_PAGO_WEBHOOK_SECRET não configurada!')
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    // Construir string canônica: id:{data.id};request-id:{x-request-id};ts:{ts};
    const canonical = `id:${dataId};request-id:${requestId};ts:${ts};`

    // Computar HMAC-SHA256
    const expected = crypto
      .createHmac('sha256', secret)
      .update(canonical)
      .digest('hex')

    // Comparar em tempo constante
    const isValid =
      expected.length === v1.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))

    if (!isValid) {
      console.warn('Assinatura HMAC inválida!')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // ✅ Assinatura válida! Responder 200 IMEDIATAMENTE
    const response = NextResponse.json({ status: 'received' }, { status: 200 })

    // Processar notificação ASSINCRONAMENTE após responder
    processNotification(body).catch((err) => {
      console.error('Erro ao processar notificação:', err)
    })

    return response
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function processNotification(body: any) {
  const { data, type } = body
  const paymentId = data?.id || body?.id

  if (!paymentId) {
    console.warn('Notificação sem ID de pagamento')
    return
  }

  // Apenas processar notificações de pagamento
  if (type !== 'payment') {
    console.log(`Notificação ignorada, tipo: ${type}`)
    return
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

  try {
    // Buscar detalhes do pagamento
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!paymentResponse.ok) {
      console.error('Erro ao buscar pagamento:', paymentResponse.status)
      return
    }

    const payment = await paymentResponse.json()
    const bookingId = parseInt(payment.external_reference)

    if (!bookingId) {
      console.warn('Pagamento sem external_reference')
      return
    }

    // Atualizar booking baseado no status do pagamento
    if (payment.status === 'approved') {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'paid',
          payment_status: 'approved',
          admin_confirmed: false,
        })
        .eq('id', bookingId)

      if (error) {
        console.error('Erro ao atualizar reserva para pago:', error)
      } else {
        console.log(`✅ Reserva ${bookingId} pagamento aprovado via Mercado Pago`)
      }
    } else if (payment.status === 'pending') {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'pending',
        })
        .eq('id', bookingId)

      if (error) console.error('Erro ao atualizar status pendente:', error)
      else console.log(`⏳ Reserva ${bookingId} pagamento pendente`)
    } else if (payment.status === 'rejected') {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          payment_status: 'rejected',
        })
        .eq('id', bookingId)

      if (error) console.error('Erro ao cancelar reserva:', error)
      else console.log(`❌ Reserva ${bookingId} pagamento rejeitado`)
    }
  } catch (error) {
    console.error('Erro ao processar notificação de pagamento:', error)
  }
}
