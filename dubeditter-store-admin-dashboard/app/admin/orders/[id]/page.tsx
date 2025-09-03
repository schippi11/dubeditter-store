"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (saved) setToken(saved || '');
  }, []);

  useEffect(() => {
    if (!params?.id || !token) return;
    const run = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/admin/orders/${params.id}`, { headers: { 'x-admin-token': token }});
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrder(data.order);
      } catch (e: any) {
        setError(e.message || 'Feil ved henting');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params?.id, token]);

  const NOK = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: (order?.currency || 'NOK').toUpperCase() });

  return (
    <main className="max-w-3xl mx-auto p-6 print:p-0">
      <button onClick={() => router.back()} className="mb-4 px-3 py-2 rounded-full bg-gray-100">← Tilbake</button>
      <h1 className="text-3xl font-bold mb-4">Ordre-detaljer</h1>
      {loading && <p>Laster…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {order && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">OrderID</div>
              <div className="font-mono">{order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Dato</div>
              <div>{new Date(order.created).toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-1">Kunde</h2>
              <div>{order.customer_name || '-'}</div>
              <div className="text-sm text-gray-600">{order.customer_email || '-'}</div>
              {order.customer_address && (
                <div className="text-sm text-gray-600 mt-2">
                  {order.customer_address.line1}<br/>
                  {order.customer_address.postal_code} {order.customer_address.city}<br/>
                  {order.customer_address.country}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold mb-1">Betaling</h2>
              <div>Status: <span className="font-medium">{order.payment_status}</span></div>
              <div>Totalt: <span className="font-medium">{order.amount_total ? NOK.format(order.amount_total/100) : '-'}</span></div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Produkter</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Varenavn</th>
                  <th className="py-2">Antall</th>
                  <th className="py-2">Beløp</th>
                </tr>
              </thead>
              <tbody>
                {order.line_items.map((li: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{li.description}</td>
                    <td className="py-2">{li.quantity}</td>
                    <td className="py-2">{NOK.format(li.amount_total/100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 print:hidden">
            <button onClick={() => window.print()} className="px-4 py-2 rounded-full bg-gray-900 text-white">Skriv ut</button>
            <a href="/admin" className="px-4 py-2 rounded-full bg-gray-100">Til oversikten</a>
          </div>
        </div>
      )}
    </main>
  );
}
