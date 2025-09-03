import "./globals.css";
import ServiceWorkerRegister from "./sw-register";
import A2HS from "./a2hs-prompt";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dubeditter.no – Små, kule og nyttige dubeditter",
  description: "Alt mulig-butikken for små dubeditter med rask utsjekk via Stripe.",
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Dubeditter" className="h-8 w-auto" />
              <span className="font-extrabold tracking-tight text-lg">Dubeditter.no</span>
            </a>
            <nav className="text-sm">
              <a className="px-3 py-2 rounded-full hover:bg-gray-100" href="/frakt">Frakt</a>
              <a className="px-3 py-2 rounded-full hover:bg-gray-100" href="/retur">Retur</a>
              <a className="px-3 py-2 rounded-full hover:bg-gray-100" href="/personvern">Personvern</a>
              <a className="px-3 py-2 rounded-full hover:bg-gray-100" href="/admin">Admin</a>
            </nav>
          </div>
        </header>
        <main className="min-h-[80vh]">{children}</main>
        <footer className="border-t py-8">
          <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 flex items-center justify-between">
            <div>© {new Date().getFullYear()} Dubeditter.no</div>
            <div>Kontakt: <a href="mailto:post@dubeditter.no" className="underline">post@dubeditter.no</a></div>
          </div>
        </footer>
        <ServiceWorkerRegister />
        <A2HS />
      </body>
    </html>
  );
}
