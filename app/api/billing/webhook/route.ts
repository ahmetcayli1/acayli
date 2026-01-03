import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const { userId, type } = session.metadata;

    if (userId && type === 'FULL_RESULTS_UNLOCK') {
        // Create Purchase
        await prisma.purchase.create({
            data: {
                userId,
                stripeSessionId: session.id,
                amount: session.amount_total / 100,
                currency: session.currency,
                status: session.payment_status,
            }
        });

        // Create Entitlement
        await prisma.entitlement.create({
            data: {
                userId,
                type: 'FULL_RESULTS_UNLOCK',
                status: 'ACTIVE'
            }
        });
        
        console.log(`Entitlement granted for user ${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}
