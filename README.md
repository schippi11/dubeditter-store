

## 🔐 Admin (stripe-ordrer)
- Side: `/admin`
- Miljøvariable (Vercel → Project → Settings → Environment Variables):
  - `STRIPE_SECRET_KEY` – din Stripe nøkkel (test eller live)
  - `ADMIN_PASSWORD` – velg et sterkt passord (du skriver dette i admin-siden)
- API: `/api/admin/orders` henter de siste Checkout Sessions fra Stripe og viser dem i admin
- CSV-eksport direkte fra admin-siden
