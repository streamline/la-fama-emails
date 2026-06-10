'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscribersPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/subscribers').then(r => r.json()).then(d => setSubs(d.subscribers || []));
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/subscribers/import', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    setMessage(`✅ Importados: ${result.imported} | Errores: ${result.errors} | Total: ${result.total}`);
    setUploading(false);
    
    // Refresh
    const d = await fetch('/api/subscribers').then(r => r.json());
    setSubs(d.subscribers || []);
    const s = await fetch('/api/stats').then(r => r.json());
    setStats(s);
  };

  const handleUnsubscribe = async (id: string) => {
    await fetch(`/api/unsubscribe?id=${id}`);
    const d = await fetch('/api/subscribers').then(r => r.json());
    setSubs(d.subscribers || []);
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📋 Suscriptores</h1>
          {stats && <p className="text-gray-500 text-sm">{stats.active_subscribers} activos de {stats.total_subscribers} total</p>}
        </div>
        <button onClick={() => router.push('/admin')} className="text-gray-400 hover:text-white text-sm">
          ← Dashboard
        </button>
      </div>

      {/* Upload CSV */}
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a3e] mb-6">
        <label className="text-sm text-gray-400 mb-2 block">Importar lista (CSV: email,name)</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={uploading}
          className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
        />
        {message && <p className="text-sm mt-2 text-green-400">{message}</p>}
      </div>

      {/* Subscribers table */}
      <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3e] text-gray-500">
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-right p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s: any) => (
              <tr key={s.id} className="border-b border-[#1f1f35] hover:bg-[#242440]">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-gray-400">{s.name || '—'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    s.status === 'active' ? 'bg-green-900 text-green-300' :
                    s.status === 'unsubscribed' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>{s.status}</span>
                </td>
                <td className="p-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  {s.status === 'active' && (
                    <button onClick={() => handleUnsubscribe(s.id)} className="text-red-400 hover:text-red-300 text-xs">
                      Desuscribir
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No hay suscriptores. Importá un CSV.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}