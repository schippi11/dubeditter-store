export default function ReturPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Retur & Angrerett</h1>
      <p>Du har 14 dagers angrerett fra du mottar varen. Varen må være i original stand.</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Kontakt oss før retur: <a className="underline" href="mailto:retur@dubeditter.no">retur@dubeditter.no</a></li>
        <li>Returkostnad dekkes av kunde ved angrerett</li>
        <li>Reklamasjon etter forbrukerkjøpsloven håndteres kostnadsfritt</li>
      </ul>
      <p>Refusjon utbetales normalt innen 5–10 virkedager etter mottatt retur.</p>
    </main>
  );
}
