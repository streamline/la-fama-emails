'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = {
  total_subscribers: number;
  active_subscribers: number;
  total_campaigns_sent: number;
  total_emails_sent: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats);
    fetch('/api/campaigns').then(r => r.json()).then(d => setCampaigns(d.campaigns || []));
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📧 La Fama Emails</h1>
          <p className="text-gray-500 text-sm">Email marketing dashboard</p>
        </div>
        <Link
          href="/admin/new"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva Campaña
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a3e]">
            <div className="text-2xl font-bold">{stats.total_subscribers}</div>
            <div className="text-gray-500 text-sm">Total Suscriptores</div>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a3e]">
            <div className="text-2xl font-bold text-green-400">{stats.active_subscribers}</div>
            <div className="text-gray-500 text-sm">Activos</div>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a3e]">
            <div className="text-2xl font-bold">{stats.total_campaigns_sent}</div>
            <div className="text-gray-500 text-sm">Campañas Enviadas</div>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a3e]">
            <div className="text-2xl font-bold text-purple-400">{stats.total_emails_sent}</div>
            <div className="text-gray-500 text-sm">Emails Enviados</div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link href="/admin/subscribers" className="bg-[#1a1a2e] hover:bg-[#222240] border border-[#2a2a3e] px-4 py-2 rounded-lg text-sm transition-colors">
          📋 Ver Suscriptores
        </Link>
        <Link href="/admin/new" className="bg-[#1a1a2e] hover:bg-[#222240] border border-[#2a2a3e] px-4 py-2 rounded-lg text-sm transition-colors">
          ✉️ Crear Campaña
        </Link>
      </div>

      {/* Campaigns list */}
      <h2 className="text-lg font-semibold mb-3">Últimas Campañas</h2>
      <div className="space-y-2">
        {campaigns.length === 0 && (
          <p className="text-gray-500 text-sm">No hay campañas todavía. Creá la primera!</p>
        )}
        {campaigns.map((c: any) => (
          <div key={c.id} className="bg-[#1a1a2e] rounded-lg p-4 border border-[#2a2a3e] flex items-center justify-between">
            <div>
              <div className="font-medium">{c.subject}</div>
              <div className="text-gray-500 text-xs">
                {c.status} · {c.total_recipients || 0} recipients · {new Date(c.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              c.status === 'sent' ? 'bg-green-900 text-green-300' :
              c.status === 'sending' ? 'bg-yellow-900 text-yellow-300' :
              'bg-gray-800 text-gray-400'
            }`}>
              {c.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}