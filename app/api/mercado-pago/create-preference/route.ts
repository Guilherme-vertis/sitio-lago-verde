import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookingId,
      guestName,
      guestEmail,
      amount,
      houseName,
      checkIn,
      checkOut
    } = body

    if (!amount || !guestEmail || !bookingId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

    const preference = {
      items: [
        {
          title: `Reserva - ${houseName}`,
          description: `Check-in: ${checkIn} | Check-out: ${checkOut}`,
          unit_price: amount,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        name: guestName,
        email: guestEmail,
      },
      external_reference: bookingId.toString(),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/confirmacao?booking=${bookingId}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/reservas?error=pagamento_falhou`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/reservas?status=pendente`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/webhook`,
      auto_return: 'approved',
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Erro Mercado Pago:', error)
      return NextResponse.json(
        { error: 'Erro ao criar preferência de pagamento' },
        { status: 500 }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
    })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
