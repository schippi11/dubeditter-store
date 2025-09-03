import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const token = req.headers.get("x-admin-token") || "";
  if (!adminPassword || token !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" as any });
  try {
    const session = await stripe.checkout.sessions.retrieve(params.id, { expand: ["line_items", "payment_intent", "customer"] });
    const order = {
      id: session.id,
      created: session.created * 1000,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email || null,
      customer_name: session.customer_details?.name || null,
      customer_address: session.customer_details?.address || null,
      payment_status: session.payment_status,
      line_items: (session.line_items?.data || []).map((li: any) => ({
        description: li.description,
        quantity: li.quantity,
        amount_total: li.amount_total,
        currency: li.currency,
      }))
    };
    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
