import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil" as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ success: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Update booking status to confirmed
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await supabase
          .from("bookings")
          .update({ status: "confirmed", stripe_payment_id: session_id })
          .eq("id", bookingId);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, status: session.payment_status });
  } catch (error: any) {
    console.error("[verify-session] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
