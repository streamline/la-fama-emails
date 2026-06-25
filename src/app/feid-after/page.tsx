import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FEID AFTER — Australia | Official After Party",
  description:
    "🔥 El after party oficial de Feid en Australia. Sydney (28 Jun) · Melbourne (29 Jun) · Brisbane (1 Jul). Entradas limitadas — asegurá tu lugar.",
  openGraph: {
    title: "FEID AFTER — Australia | Official After Party",
    description:
      "🔥 El after party oficial de Feid en Australia. Sydney (28 Jun) · Melbourne (29 Jun) · Brisbane (1 Jul). Entradas limitadas — asegurá tu lugar.",
    url: "https://la-fama-emails.vercel.app/feid-after",
    siteName: "La Fama Events",
    type: "website",
    images: [
      {
        url: "https://raw.githubusercontent.com/streamline/la-fama-emails/main/public/emails/feid-after-flyer.jpg",
        width: 1200,
        height: 630,
        alt: "Feid After Party Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FEID AFTER — Australia | Official After Party",
    description:
      "🔥 El after party oficial de Feid en Australia. Sydney · Melbourne · Brisbane.",
    images: [
      "https://raw.githubusercontent.com/streamline/la-fama-emails/main/public/emails/feid-after-flyer.jpg",
    ],
  },
};

export default function FeidAfterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="max-w-lg w-full text-center">
        {/* Hero */}
        <div className="py-8">
          <p className="text-[11px] text-[#39ff88] tracking-[4px] uppercase font-bold mb-2">
            ✦ OFFICIAL AFTER PARTY ✦
          </p>
          <h1 className="text-[58px] text-white font-black tracking-[-3px] leading-[0.95] drop-shadow-[0_0_40px_rgba(57,255,136,0.25)]">
            FEID
            <br />
            AFTER
          </h1>
          <p className="text-lg text-[#39ff88] mt-2 tracking-[6px] uppercase font-light">
            I S &nbsp; O F F I C I A L
          </p>
        </div>

        {/* Flyer */}
        <img
          src="https://raw.githubusercontent.com/streamline/la-fama-emails/main/public/emails/feid-after-flyer.jpg"
          alt="Feid After Party"
          className="w-full rounded-xl shadow-2xl"
        />

        {/* Description */}
        <p className="text-[#aaa] text-sm mt-6 leading-relaxed">
          🔥 <strong className="text-white">EL AFTER PARTY MÁS ESPERADO DEL AÑO</strong> 🔥
          <br />
          La noche del Ferxxo no termina en el concierto.
          <br />
          <strong className="text-[#39ff88]">Tres ciudades. Una fiesta. Cero límites.</strong>
        </p>

        {/* Cities */}
        <div className="mt-6 space-y-3">
          {[
            { city: "SYDNEY", date: "SÁBADO · 28 DE JUNIO" },
            { city: "MELBOURNE", date: "DOMINGO · 29 DE JUNIO" },
            { city: "BRISBANE", date: "MARTES · 1 DE JULIO" },
          ].map((c) => (
            <div
              key={c.city}
              className="flex items-center bg-[#111] rounded-xl p-4 border border-[#1d1d1d]"
            >
              <div className="w-[5px] min-h-[54px] bg-[#39ff88] rounded-[3px] mr-3.5 shadow-[0_0_8px_rgba(57,255,136,0.4)]" />
              <div className="flex-1 text-left">
                <p className="text-white text-[22px] font-black tracking-[1px]">
                  {c.city}
                </p>
                <p className="text-[#777] text-[12px] mt-[1px] tracking-[1px]">
                  {c.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 border border-[#1a3a2a] rounded-xl bg-[#0f0f0f]">
          <p className="text-[#39ff88] text-[13px] font-black tracking-[3px] uppercase">
            ⚠️ ENTRADAS LIMITADAS
          </p>
          <p className="text-[#777] text-xs mt-1.5 leading-relaxed">
            Capacidad reducida por ciudad. Se va a llenar — no te quedes sin tu entrada.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pb-6">
          <p className="text-[#333] text-[10px] leading-relaxed">
            La Fama · Feid After Party Australia
            <br />
            Sydney · Melbourne · Brisbane
          </p>
        </div>
      </div>
    </main>
  );
}