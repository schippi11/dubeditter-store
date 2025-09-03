"use client";
import React, { useMemo, useState } from "react";
import { ShoppingCart, Trash2, Smartphone, Utensils, Heart, Gamepad2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: "Teknologi" | "Hjem & Kjøkken" | "Velvære" | "Underholdning";
  image: string;
  tags?: ("Bestselger" | "Tilbud" | "Nyhet")[];
};

// Full produktkatalog
const products: Product[] = [
  // Teknologi & Gadgets
  { id: 1, name: "Trådløs Ladebase", price: 399, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61uVYqQ8NXL._AC_SL1500_.jpg", tags: ["Nyhet"] },
  { id: 2, name: "Powerbank 20,000mAh", price: 499, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 3, name: "Bluetooth Høyttaler Vanntett", price: 299, oldPrice: 399, category: "Teknologi", image: "https://m.media-amazon.com/images/I/71-9OEnAABL._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 4, name: "Trådløse Earbuds", price: 349, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg", tags: [] },
  { id: 11, name: "Magnetisk Bilholder", price: 149, category: "Teknologi", image: "https://bornnordic.com/media/catalog/product/cache/926507dc7f93631a094422215b778fe0/f/o/forever-universal-magnetisk-mobilholder-til-bil-sort.jpg", tags: ["Bestselger"] },
  { id: 12, name: "LED Selfie Ring Light", price: 299, oldPrice: 399, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61MbLLGiKXL._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 15, name: "Smartklokke Fitness Tracker", price: 599, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61U2djSbn4L._AC_SL1500_.jpg", tags: [] },
  { id: 16, name: "USB-C Hub 7-i-1", price: 349, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61pOprKqVQL._AC_SL1500_.jpg", tags: [] },
  { id: 17, name: "Trådløs Gamingmus RGB", price: 249, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61P6aPBI1hL._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 18, name: "WiFi Mini Kamera", price: 499, category: "Teknologi", image: "https://m.media-amazon.com/images/I/61z5Hqv1xJL._AC_SL1500_.jpg", tags: ["Nyhet"] },

  // Hjem & Kjøkken
  { id: 5, name: "Digital Kjøkkenvekt", price: 199, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/71OfdXlgl0L._AC_SL1500_.jpg", tags: [] },
  { id: 6, name: "Multifunksjons Kjøkkensaks", price: 149, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/61ZytFHPRmL._AC_SL1001_.jpg", tags: ["Bestselger"] },
  { id: 7, name: "Digitalt Mattermometer", price: 249, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/61V9zv8dPzL._AC_SL1500_.jpg", tags: [] },
  { id: 14, name: "Silikon Lokk Sett (6 stk)", price: 199, category: "Hjem & Kjøkken", image: "https://nor.grandado.com/cdn/shop/files/6-stk-silikonlokk-matdeksel-stretch-lokk.jpg", tags: ["Bestselger"] },
  { id: 19, name: "Elektrisk Melkeskummer", price: 249, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/61W9w3C85xL._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 20, name: "Bærbar Smoothie Blender", price: 399, oldPrice: 499, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/61m4oUuN3-L._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 21, name: "Silikon Bakeformer Sett", price: 179, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/81k+ZAkBzvL._AC_SL1500_.jpg", tags: [] },
  { id: 22, name: "Automatisk Krydderkvern", price: 299, category: "Hjem & Kjøkken", image: "https://m.media-amazon.com/images/I/71ZxN9fw4WL._AC_SL1500_.jpg", tags: ["Nyhet"] },

  // Velvære
  { id: 8, name: "Facial Ice Bath Bowl", price: 229, category: "Velvære", image: "https://m.media-amazon.com/images/I/61Xc6ZtYZrL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 9, name: "2-i-1 Silikon Ansiktsbørste", price: 99, category: "Velvære", image: "https://m.media-amazon.com/images/I/71lxRQv7nhL._AC_SL1500_.jpg", tags: [] },
  { id: 10, name: "Finger Grip Strengthener", price: 129, category: "Velvære", image: "https://m.media-amazon.com/images/I/61kfcJ33RjL._AC_SL1500_.jpg", tags: [] },
  { id: 23, name: "Mini Massasjepistol", price: 599, category: "Velvære", image: "https://m.media-amazon.com/images/I/61pvLMoy6cL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 24, name: "Sovemaske med Bluetooth", price: 349, category: "Velvære", image: "https://m.media-amazon.com/images/I/61yr7OZ6uRL._AC_SL1000_.jpg", tags: [] },
  { id: 25, name: "Elektrisk Fotvarmer", price: 499, category: "Velvære", image: "https://m.media-amazon.com/images/I/71Vmvzx1BML._AC_SL1500_.jpg", tags: [] },
  { id: 26, name: "Ansiktsrulle Jade", price: 199, category: "Velvære", image: "https://m.media-amazon.com/images/I/71Uq4rEmrfL._AC_SL1500_.jpg", tags: ["Nyhet"] },

  // Underholdning
  { id: 13, name: "Mini Projektor HD", price: 899, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71dG1wMVEFL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 27, name: "VR Briller Mobil", price: 499, category: "Underholdning", image: "https://m.media-amazon.com/images/I/61VfX1k0d+L._AC_SL1500_.jpg", tags: ["Nyhet"] },
  { id: 28, name: "LED Strip Lys RGB", price: 299, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71K2vbyZysL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 29, name: "Retro Mini Spillkonsoll", price: 399, oldPrice: 499, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71TzVtYVpoL._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 30, name: "Sammenleggbart Projektorlerret", price: 599, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71s7a7h7R-L._AC_SL1500_.jpg", tags: [] },
  { id: 31, name: "Trådløs Gamepad Controller", price: 349, oldPrice: 449, category: "Underholdning", image: "https://m.media-amazon.com/images/I/61V6KZz5i4L._AC_SL1500_.jpg", tags: ["Tilbud"] },
  { id: 32, name: "Galaxy Projector Stjernehimmel", price: 499, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71Tsv8sW8XL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 33, name: "Karaoke Mikrofon Bluetooth", price: 299, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71Eq9xjsYfL._AC_SL1500_.jpg", tags: ["Bestselger"] },
  { id: 34, name: "Actionkamera HD", price: 799, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71H+KoQK6tL._AC_SL1500_.jpg", tags: [] },
  { id: 35, name: "3D Illusjonslampe Fotball", price: 249, category: "Underholdning", image: "https://m.media-amazon.com/images/I/71fDRLB3vUL._AC_SL1500_.jpg", tags: [] },
  { id: 36, name: "LED Lys som Synkroniseres med Musikk", price: 399, category: "Underholdning", image: "https://m.media-amazon.com/images/I/81scyQF4V4L._AC_SL1500_.jpg", tags: ["Nyhet"] },
  { id: 37, name: "Elektronisk Terningspill", price: 199, category: "Underholdning", image: "https://m.media-amazon.com/images/I/61sBlDHDXrL._AC_SL1000_.jpg", tags: ["Nyhet"] },
];

const categories = [
  { name: "Alle", icon: null },
  { name: "Teknologi", icon: Smartphone },
  { name: "Hjem & Kjøkken", icon: Utensils },
  { name: "Velvære", icon: Heart },
  { name: "Underholdning", icon: Gamepad2 },
] as const;

const featured = [2, 8, 12, 14, 23, 28, 32, 33, 20];
const NOK = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });

function QuickView({ product, onClose }: { product: any, onClose: () => void }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
          <button className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 text-sm" onClick={onClose}>Lukk</button>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <div className="flex items-center gap-2">
            {product.oldPrice && <span className="text-sm text-gray-400 line-through">{NOK.format(product.oldPrice)}</span>}
            <span className="text-purple-700 font-bold">{NOK.format(product.price)}</span>
          </div>
          <p className="text-sm text-gray-600">Kort beskrivelse: Praktisk og populær dubeditt. Levering 5–12 virkedager.</p>
          <div className="flex gap-3 pt-2">
            <a href="#shop" className="px-4 py-2 rounded-full bg-gray-900 text-white">Til produktene</a>
            <button className="px-4 py-2 rounded-full bg-gray-100" onClick={onClose}>Lukk</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [cart, setCart] = useState<Product[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]["name"]>("Alle");
  const [query, setQuery] = useState("");
  const [quickView, setQuickView] = useState<any | null>(null);

  const addToCart = (product: Product) => setCart([...cart, product]);
  const removeFromCart = (id: number) => setCart(cart.filter((_, index) => index !== id));
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);
  const percentOff = (p: Product) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

  const byCategory = selectedCategory === "Alle" ? products : products.filter(p => p.category === selectedCategory);
  const filteredProducts = useMemo(() => {
    if (!query) return byCategory;
    const q = query.toLowerCase();
    return byCategory.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q));
  }, [selectedCategory, query]);

  const newsProducts = products.filter(p => p.tags?.includes("Nyhet")).slice(0, 8);

  const handleCheckout = async () => {
    try { if (typeof window !== 'undefined') localStorage.setItem('order_cart', JSON.stringify(cart)); } catch {}
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md p-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center cursor-pointer" onClick={() => setCheckout(false)}>
          <img src="/logo.png" alt="Dubeditter logo" className="h-10 w-auto mr-2" />
          <span className="text-xl font-extrabold drop-shadow-lg">Dubeditter.no</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full w-full sm:w-80">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søk etter produkter..."
              className="bg-transparent placeholder-white/80 text-white outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 cursor-pointer bg-white/20 px-3 py-2 rounded-full" onClick={() => setCheckout(true)}>
            <ShoppingCart className="text-white" />
            <span>{cart.length}</span>
          </div>
        </div>
      </header>

      {!checkout ? (
        <>
          {/* Hero banner */}
          <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-center py-16 shadow-lg">
            <h2 className="text-4xl font-extrabold drop-shadow-lg animate-pulse">Velkommen til Dubeditter.no</h2>
            <p className="mt-4 text-lg opacity-90">Små, kule og nyttige dubeditter til gode priser 🚀</p>
            <a href="#shop" className="inline-block mt-6 px-6 py-3 text-lg rounded-full shadow-lg bg-white text-purple-700 hover:bg-yellow-300 transition-transform hover:scale-105">
              Shop Nå
            </a>
          </section>

          {/* Populært nå */}
          <section className="p-6" id="shop">
            <h2 className="text-3xl font-bold mb-6 text-purple-700">🔥 Populært nå</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.filter(p => featured.includes(p.id)).map((p) => (
                <motion.div key={p.id} whileHover={{ scale: 1.05 }}>
                  <Card className="rounded-2xl shadow-xl overflow-hidden border border-purple-100 relative">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      {p.tags?.includes("Bestselger") && <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-1 rounded-full">Bestselger</span>}
                      {p.tags?.includes("Nyhet") && <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">Nyhet</span>}
                      {p.tags?.includes("Tilbud") && p.oldPrice && (
                        <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">-{percentOff(p)}%</span>
                      )}
                    </div>

                    <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                    <CardContent className="p-4 flex flex-col justify-between">
                      <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
                      <div className="flex items-center gap-2">
                        {p.oldPrice && <span className="text-sm text-gray-400 line-through">{NOK.format(p.oldPrice)}</span>}
                        <span className="text-purple-600 font-bold">{NOK.format(p.price)}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90" onClick={() => addToCart(p)}>Legg i handlekurv</Button>
                        <Button variant="outline" className="rounded-full" onClick={() => setQuickView(p)}>Se detaljer</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Nyheter */}
          <section className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">🆕 Nyheter</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newsProducts.map((p) => (
                <motion.div key={p.id} whileHover={{ scale: 1.05 }}>
                  <Card className="rounded-2xl shadow-lg overflow-hidden border border-indigo-100 relative">
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">Nyhet</span>
                      {p.tags?.includes("Tilbud") && p.oldPrice && (
                        <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">-{percentOff(p)}%</span>
                      )}
                    </div>
                    <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
                      <div className="flex items-center gap-2">
                        {p.oldPrice && <span className="text-sm text-gray-400 line-through">{NOK.format(p.oldPrice)}</span>}
                        <span className="text-indigo-600 font-bold">{NOK.format(p.price)}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90" onClick={() => addToCart(p)}>Legg i handlekurv</Button>
                        <Button variant="outline" className="rounded-full" onClick={() => setQuickView(p)}>Se detaljer</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Kategorimeny */}
          <nav className="flex justify-center gap-4 p-6 bg-white/80 backdrop-blur shadow-md sticky top-0 z-10">
            {categories.map(cat => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${selectedCategory === cat.name ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'text-purple-700 border-purple-300'}`}
                onClick={() => setSelectedCategory(cat.name as any)}
              >
                {cat.icon && <cat.icon size={18} />} {cat.name}
              </Button>
            ))}
          </nav>

          {/* Produkter */}
          <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <motion.div key={p.id} whileHover={{ scale: 1.05 }}>
                <Card className="rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition relative">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {p.tags?.includes("Bestselger") && <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-1 rounded-full">Bestselger</span>}
                    {p.tags?.includes("Nyhet") && <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">Nyhet</span>}
                    {p.tags?.includes("Tilbud") && p.oldPrice && (
                      <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">-{percentOff(p)}%</span>
                    )}
                  </div>

                  <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
                  <CardContent className="p-4 flex flex-col justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
                    <div className="flex items-center gap-2">
                      {p.oldPrice && <span className="text-sm text-gray-400 line-through">{NOK.format(p.oldPrice)}</span>}
                      <span className="text-pink-600 font-bold">{NOK.format(p.price)}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90" onClick={() => addToCart(p)}>Legg i handlekurv</Button>
                      <Button variant="outline" className="rounded-full" onClick={() => setQuickView(p)}>Se detaljer</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </main>

          {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
        </>
      ) : (
        <>
          {/* Handlekurv */}
          <section className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-purple-700">🛒 Handlekurv</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Handlekurven er tom</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between bg-white shadow p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          {item.oldPrice && <span className="text-sm text-gray-400 line-through">{NOK.format(item.oldPrice)}</span>}
                          <p className="text-purple-600 font-bold">{NOK.format(item.price)}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => removeFromCart(index)}>
                      <Trash2 className="text-red-500" />
                    </Button>
                  </motion.div>
                ))}

                <div className="flex justify-between items-center font-bold text-xl border-t pt-4 text-gray-800">
                  <span>Total:</span>
                  <span className="text-green-600">{NOK.format(total)}</span>
                </div>

                <Button className="w-full mt-4 py-3 text-lg rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90" onClick={handleCheckout}>
                  Gå til betaling
                </Button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
