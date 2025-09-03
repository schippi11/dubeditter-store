import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
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
    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
      expand: ["data.line_items"]
    });

    const orders = sessions.data.map((s) => ({
      id: s.id,
      created: s.created * 1000,
      amount_total: s.amount_total,
      currency: s.currency,
      customer_email: s.customer_details?.email || null,
      line_items: (s.line_items?.data || []).map((li: any) => ({
        description: li.description,
        quantity: li.quantity,
        amount_total: li.amount_total,
        currency: li.currency,
      }))
    }));

    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
