import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil" as any,
  });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      amount,
      currency = "eur",
      origin,
      destination,
      email,
    } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "Missing bookingId or amount" },
        { status: 400 }
      );
    }

    // Get the origin for success/cancel URLs
    const origin_url = req.headers.get("origin") || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Chauffeur Service: ${origin} → ${destination}`,
              description: `Booking ${bookingId}`,
            },
            // Stripe expects amount in cents
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId,
      },
      success_url: `${origin_url}/${body.locale || "en"}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin_url}/${body.locale || "en"}/booking/cancel?booking_id=${bookingId}`,
    });

    // Update booking with stripe session id
    await getSupabase()
      .from("bookings")
      .update({
        stripe_payment_id: session.id,
        status: "confirmed",
      })
      .eq("id", bookingId);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[stripe checkout] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
