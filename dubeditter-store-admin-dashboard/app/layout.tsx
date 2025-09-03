export const metadata = {
  icons: {
    icon: '/favicon.png'
  },
  title: "Dubeditter.no – Små, kule og nyttige dubeditter",
  description: "Alt mulig-butikken for små dubeditter med rask utsjekk via Stripe.",
};
import "./globals.css";
import A2HS from "./a2hs-prompt";
import ServiceWorkerRegister from "./sw-register";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        {children}
        <ServiceWorkerRegister />
        <A2HS />
        <footer className="mt-16 border-t">
          <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold">Dubeditter.no</h3>
              <p>Små, kule og nyttige dubeditter.</p>
            </div>
            <div>
              <h3 className="font-semibold">Kundeservice</h3>
              <ul className="space-y-1 underline">
                <li><a href="/frakt">Frakt & levering</a></li>
                <li><a href="/retur">Retur & angrerett</a></li>
                <li><a href="/personvern">Personvern</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Kontakt</h3>
              <p><a className="underline" href="mailto:post@dubeditter.no">post@dubeditter.no</a></p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
