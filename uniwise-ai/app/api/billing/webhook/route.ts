import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const matchRunId = session.metadata?.matchRunId

      if (!userId) {
        console.error('No userId in session metadata')
        return NextResponse.json({ error: 'No userId' }, { status: 400 })
      }

      // Create purchase record
      await prisma.purchase.create({
        data: {
          userId,
          stripeSessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'COMPLETED',
        },
      })

      // Create entitlement
      await prisma.entitlement.create({
        data: {
          userId,
          type: 'FULL_RESULTS_UNLOCK',
          status: 'ACTIVE',
        },
      })

      console.log(`✅ Payment completed for user ${userId}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
