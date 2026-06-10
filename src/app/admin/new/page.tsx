'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCampaignPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [fromName, setFromName] = useState('La Fama');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const createAndSend = async () => {
    if (!subject || !content) {
      setMessage('⚠️ Subject y contenido son requeridos');
      return;
    }
    setSending(true);
    setMessage('');

    // Create campaign
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        from_name: fromName,
        html_content: content,
      }),
    });
    const { campaign } = await res.json();
    if (!campaign) { setMessage('❌ Error creating campaign'); setSending(false); return; }

    // Ask to send
    const confirmSend = confirm('¿Enviar a TODOS los suscriptores activos ahora?');
    if (!confirmSend) {
      setMessage('✅ Campaña guardada como draft — no enviada');
      setSending(false);
      router.push('/admin');
      return;
    }

    // Send
    const sendRes = await fetch('/api/campaigns/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign_id: campaign.id }),
    });
    const result = await sendRes.json();
    setMessage(`✅ Enviado! ${result.sent} de ${result.total} emails`);
    setSending(false);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-purple-400 mb-6">✉️ Nueva Campaña</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Subject</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
            placeholder="Ej: 🔥 Esta noche: La Fama After Party"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">De (nombre)</label>
          <input
            value={fromName}
            onChange={e => setFromName(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email HTML</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={15}
            className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-4 py-2 text-gray-100 font-mono text-sm focus:outline-none focus:border-purple-500"
            placeholder="<html><body> ... contenido del email ... </body></html>"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={createAndSend}
            disabled={sending}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:text-gray-400 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {sending ? 'Enviando...' : 'Guardar y Enviar'}
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="bg-[#1a1a2e] hover:bg-[#222240] border border-[#2a2a3e] px-6 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
        {message && (
          <p className="text-sm mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}