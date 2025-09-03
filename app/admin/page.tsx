"use client";
import { useEffect, useMemo, useState } from "react";

type Order = {
  id: string;
  created: number;
  amount_total: number | null;
  currency: string | null;
  customer_email: string | null;
  line_items: { description: string; quantity: number; amount_total: number; currency: string; }[];
};

function toCSV(orders: Order[]) {
  const header = ['OrderID','Dato','Kunde-e-post','Varenavn','Antall','Linje beløp','Valuta','Ordre total'];
  const rows: string[][] = [];
  for (const o of orders) {
    if (o.line_items.length === 0) {
      rows.push([o.id, new Date(o.created).toISOString(), o.customer_email || '', '', '0', '0', o.currency || '', String(o.amount_total || 0)]);
    } else {
      for (const li of o.line_items) {
        rows.push([
          o.id,
          new Date(o.created).toISOString(),
          o.customer_email || '',
          li.description || '',
          String(li.quantity || 0),
          String(li.amount_total || 0),
          li.currency || '',
          String(o.amount_total || 0),
        ]);
      }
    }
  }
  return [header, ...rows].map(r => r.map(x => JSON.stringify(x ?? '')).join(',')).join('\n');
}

export default function AdminPage() {
  const [token, setToken] = useState<string>('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (saved) setToken(saved);
  }, []);

  const fetchOrders = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'x-admin-token': token } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.orders || []);
      if (typeof window !== 'undefined') localStorage.setItem('admin_token', token);
      setAuthed(true);
    } catch (e: any) {
      setError(e.message || 'Feil ved henting');
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const d = new Date(o.created);
      const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      const amt = (o.amount_total || 0);
      map.set(key, (map.get(key) || 0) + amt);
    }
    return Array.from(map.entries()).sort((a,b) => a[0] < b[0] ? -1 : 1);
  }, [orders]);

  const kpis = useMemo(() => {
    const total = orders.reduce((s,o) => s + (o.amount_total || 0), 0);
    const count = orders.length;
    const aov = count ? total / count : 0;
    return { total, count, aov };
  }, [orders]);

  const maxDay = useMemo(() => byDay.reduce((m, [,v]) => Math.max(m, v), 0), [byDay]);

  const downloadCSV = () => {
    const csv = toCSV(orders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dubeditter_orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin – Ordrer</h1>

      <div className="bg-white rounded-xl border p-4 mb-6">
        <label className="block text-sm font-medium mb-2">Admin-passord (sett i Vercel som ADMIN_PASSWORD)</label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Skriv inn admin-passord"
          className="w-full border rounded-md px-3 py-2"
        />
        <button onClick={fetchOrders} className="mt-3 px-4 py-2 rounded-full bg-gray-900 text-white">
          {loading ? 'Laster...' : 'Logg inn & hent ordrer'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {authed && (
        
      {authed && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white border rounded-xl p-4">
            <div className="text-sm text-gray-600">Omsetning (sum)</div>
            <div className="text-2xl font-bold">{(kpis.total/100).toFixed(0)} NOK</div>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <div className="text-sm text-gray-600">Antall ordrer</div>
            <div className="text-2xl font-bold">{kpis.count}</div>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <div className="text-sm text-gray-600">Snittordre</div>
            <div className="text-2xl font-bold">{(kpis.aov/100).toFixed(0)} NOK</div>
          </div>
        </div>
      )}

      {authed && byDay.length > 0 && (
        <div className="bg-white border rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Omsetning per dag</h3>
            <span className="text-sm text-gray-600">Siste {byDay.length} dager</span>
          </div>
          <div className="h-28 flex items-end gap-2">
            {byDay.map(([day, val]) => {
              const h = maxDay ? Math.max(4, Math.round((val / maxDay) * 100)) : 0;
              return (
                <div key={day} className="flex flex-col items-center">
                  <div className="w-6 rounded-t bg-gradient-to-t from-purple-500 to-pink-500" style={{ height: h + '%' }} />
                  <div className="text-[10px] mt-1 text-gray-600">{day.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Siste ordrer</h2>
            <button onClick={downloadCSV} className="px-3 py-2 rounded-full bg-gray-100">Last ned CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Dato</th>
                  <th className="py-2 pr-4">OrderID</th>
                  <th className="py-2 pr-4">Kunde</th>
                  <th className="py-2 pr-4">Vare(r)</th>
                  <th className="py-2 pr-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b align-top">
                    <td className="py-2 pr-4">{new Date(o.created).toLocaleString()}</td>
                    <td className="py-2 pr-4"><a className="underline" href={`/admin/orders/${o.id}`}>{o.id}</a></td>
                    <td className="py-2 pr-4">{o.customer_email || '-'}</td>
                    <td className="py-2 pr-4">
                      <ul className="list-disc pl-5">
                        {o.line_items.map((li, idx) => (
                          <li key={idx}>{li.description} × {li.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 pr-4">{o.amount_total ? (o.amount_total/100).toFixed(0) + ' ' + (o.currency || '').toUpperCase() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
