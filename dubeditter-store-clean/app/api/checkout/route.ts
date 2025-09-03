import { NextResponse } from "next/server";
import Stripe from "stripe";

const PRICES: Record<string, number> = {
  led_strip: 19900,
  bt_speaker: 24900,
  powerbank: 29900,
  bike_light: 14900,
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body?.items) ? body.items : [];

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe ikke konfigurert (mangler STRIPE_SECRET_KEY)." }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any });

  const line_items = items.map((i: any) => ({
    quantity: i.qty || 1,
    price_data: {
      currency: "nok",
      product_data: { name: i.id },
      unit_amount: PRICES[i.id] || 10000,
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
