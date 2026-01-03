import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { stripe, CONSULTING_PACKAGE } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { matchRunId } = body

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CONSULTING_PACKAGE.currency,
            product_data: {
              name: CONSULTING_PACKAGE.name,
              description: CONSULTING_PACKAGE.description,
            },
            unit_amount: CONSULTING_PACKAGE.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: session.user.id,
        matchRunId: matchRunId || '',
      },
      customer_email: session.user.email,
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
