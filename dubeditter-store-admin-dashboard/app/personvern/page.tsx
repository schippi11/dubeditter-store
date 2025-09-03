export default function PersonvernPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Personvern & Cookies</h1>
      <p>Vi behandler personopplysninger i henhold til GDPR. Vi samler minimumsdata for å levere bestillingen din.</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Data som behandles: navn, adresse, e-post, bestillingsdetaljer</li>
        <li>Betalingsdata håndteres av Stripe (vi lagrer ikke kortinformasjon)</li>
        <li>Vi bruker nødvendige cookies for drift og analyse</li>
      </ul>
      <p>Henvendelser om personvern: <a className="underline" href="mailto:privacy@dubeditter.no">privacy@dubeditter.no</a>.</p>
    </main>
  );
}
