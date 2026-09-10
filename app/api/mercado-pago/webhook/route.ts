import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data || !data.id) {
      return NextResponse.json({ status: 'received' })
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    // Buscar detalhes do pagamento
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${data.id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.error('Erro ao buscar pagamento')
      return NextResponse.json({ status: 'received' })
    }

    const payment = await response.json()
    const bookingId = parseInt(payment.external_reference)

    if (payment.status === 'approved') {
      // Atualizar status da reserva para paga (admin confirma depois)
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'paid',
          payment_id: payment.id,
          payment_status: 'approved',
        })
        .eq('id', bookingId)

      if (error) {
        console.error('Erro ao atualizar reserva:', error)
      } else {
        console.log(`Reserva ${bookingId} confirmada via Mercado Pago`)
      }
    } else if (payment.status === 'pending') {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'pending',
          payment_id: payment.id,
          payment_status: 'pending',
        })
        .eq('id', bookingId)

      if (error) console.error('Erro ao atualizar reserva:', error)
    } else if (payment.status === 'rejected') {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          payment_id: payment.id,
          payment_status: 'rejected',
        })
        .eq('id', bookingId)

      if (error) console.error('Erro ao atualizar reserva:', error)
    }

    return NextResponse.json({ status: 'received' })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ status: 'received' }, { status: 200 })
  }
}
