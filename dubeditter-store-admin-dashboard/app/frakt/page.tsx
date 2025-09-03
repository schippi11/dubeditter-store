export default function FraktPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Frakt & Levering</h1>
      <p>Vi sender bestillinger fortløpende fra våre lager/leverandører. Estimert levering 5–12 virkedager.</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Fast frakt: 49 kr (gratis over 799 kr)</li>
        <li>Sporing sendes på e-post når ordren behandles</li>
        <li>Del-levering kan forekomme ved flere varer</li>
      </ul>
      <p>Spørsmål? Kontakt oss på <a className="underline" href="mailto:post@dubeditter.no">post@dubeditter.no</a>.</p>
    </main>
  );
}
