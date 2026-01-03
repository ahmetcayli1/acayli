import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/session'
import prisma from '@/lib/prisma'
import { ENTITLEMENT_TYPES } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has entitlement
    const existingEntitlement = await prisma.entitlement.findFirst({
      where: {
        userId: user.id,
        type: ENTITLEMENT_TYPES.FULL_RESULTS_UNLOCK,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })

    if (existingEntitlement) {
      return NextResponse.json(
        { error: 'You already have access to full results' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { matchRunId } = body

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const successUrl = matchRunId 
      ? `${baseUrl}/results/${matchRunId}?success=true`
      : `${baseUrl}/payment/success`
    const cancelUrl = matchRunId 
      ? `${baseUrl}/results/${matchRunId}?canceled=true`
      : `${baseUrl}/payment/canceled`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: 'UNIWISE AI - Full Results Unlock',
              description: 'Get full access to all your university matches, including detailed analysis, admission probabilities, and expert recommendations.',
              images: ['https://uniwise.ai/logo.png'],
            },
            unit_amount: STRIPE_CONFIG.priceAmount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        matchRunId: matchRunId || '',
      },
      allow_promotion_codes: true,
    })

    // Create pending purchase record
    await prisma.purchase.create({
      data: {
        userId: user.id,
        stripeSessionId: session.id,
        amount: STRIPE_CONFIG.priceAmount,
        currency: STRIPE_CONFIG.currency,
        status: 'PENDING',
        metadata: { matchRunId },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
