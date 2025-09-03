"use client";
import { useEffect, useState } from "react";

export default function A2HS() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = typeof window !== 'undefined' && localStorage.getItem('a2hs_dismissed') === '1';
    if (seen) return;

    function handler(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    }
    window.addEventListener("beforeinstallprompt", handler as any);
    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
    if (typeof window !== 'undefined') localStorage.setItem('a2hs_dismissed', '1');
  };

  const dismiss = () => {
    setShow(false);
    if (typeof window !== 'undefined') localStorage.setItem('a2hs_dismissed', '1');
  };

  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-md z-50">
      <div className="mx-4 rounded-2xl shadow-xl bg-white border p-4 flex items-center justify-between">
        <div className="mr-3">
          <div className="font-semibold">Installer Dubeditter</div>
          <div className="text-sm text-gray-600">Få butikken som en app på mobilen.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={dismiss} className="px-3 py-2 text-sm rounded-full bg-gray-100">Senere</button>
          <button onClick={install} className="px-3 py-2 text-sm rounded-full bg-gray-900 text-white">Installer</button>
        </div>
      </div>
    </div>
  );
}
