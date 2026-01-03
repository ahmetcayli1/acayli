import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { stripe } from "@/app/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { runId } = await req.json();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'UNIWISE AI Consultation Package',
              description: 'Full access to personalized university recommendations.',
            },
            unit_amount: 86364, // $863.64
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/results/${runId}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/results/${runId}?canceled=true`,
      metadata: {
        userId: session.user.id,
        runId: runId,
        type: 'FULL_RESULTS_UNLOCK'
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
