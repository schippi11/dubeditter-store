"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Product = { id: string; title: string; price: number; image: string; category: string; };
const PRODUCTS: Product[] = [
  { id: "led_strip", title: "LED-lysstripe (USB)", price: 199, image: "/p_led.png", category: "Underholdning" },
  { id: "bt_speaker", title: "Mini Bluetooth-høyttaler", price: 249, image: "/p_speaker.png", category: "Underholdning" },
  { id: "powerbank", title: "Powerbank 10.000 mAh", price: 299, image: "/p_power.png", category: "Gadgets" },
  { id: "bike_light", title: "Sykkellys – sett", price: 149, image: "/p_bike.png", category: "Sport" },
];

export default function HomePage() {
  const [cart, setCart] = useState<{id: string; qty: number}[]>([]);
  const add = (id: string) => setCart(prev => {
    const f = prev.find(p => p.id === id);
    if (f) return prev.map(p => p.id===id? {...p, qty: p.qty+1}:p);
    return [...prev, {id, qty:1}];
  });
  const remove = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
  const items = cart.map(ci => ({ ...PRODUCTS.find(p => p.id===ci.id)!, qty: ci.qty }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map(i => ({ id: i.id, qty: i.qty })) }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert(data?.error || "Klarte ikke å starte betaling.");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="my-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Små, kule og nyttige dubeditter</h1>
        <p className="text-gray-600 mt-2">Rask utsjekk via Stripe. Gratis frakt over 500 kr.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PRODUCTS.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <img src={p.image} alt={p.title} className="w-full h-28 object-contain" />
              <div className="mt-2 font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.category}</div>
              <div className="mt-1 font-bold">{p.price} kr</div>
              <Button className="mt-2 w-full" onClick={() => add(p.id)}>Legg i kurv</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-4 left-0 right-0">
        <div className="max-w-6xl mx-auto px-4">
          {items.length > 0 && (
            <div className="rounded-2xl bg-white border shadow-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-sm">
                {items.map(i => (
                  <div key={i.id} className="flex items-center gap-2">
                    <span>{i.title} × {i.qty}</span>
                    <button className="text-red-600 underline" onClick={() => remove(i.id)}>Fjern</button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                <div className="font-bold">Sum: {total} kr</div>
                <Button onClick={checkout}>Gå til betaling</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
