import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { ENTITLEMENT_TYPES } from '@/lib/constants'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update purchase status
        const purchase = await prisma.purchase.findUnique({
          where: { stripeSessionId: session.id },
        })

        if (!purchase) {
          console.error('Purchase not found for session:', session.id)
          break
        }

        await prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            status: 'COMPLETED',
            stripePaymentId: session.payment_intent as string,
          },
        })

        // Create entitlement
        await prisma.entitlement.create({
          data: {
            userId: purchase.userId,
            type: ENTITLEMENT_TYPES.FULL_RESULTS_UNLOCK,
            status: 'ACTIVE',
            metadata: {
              purchaseId: purchase.id,
              sessionId: session.id,
            },
          },
        })

        console.log(`Entitlement created for user ${purchase.userId}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        await prisma.purchase.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: 'FAILED' },
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntent = charge.payment_intent as string

        // Find and update purchase
        const purchase = await prisma.purchase.findFirst({
          where: { stripePaymentId: paymentIntent },
        })

        if (purchase) {
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: { status: 'REFUNDED' },
          })

          // Revoke entitlement
          await prisma.entitlement.updateMany({
            where: {
              userId: purchase.userId,
              type: ENTITLEMENT_TYPES.FULL_RESULTS_UNLOCK,
              status: 'ACTIVE',
            },
            data: { status: 'REVOKED' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Disable body parsing, we need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}
