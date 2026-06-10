import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const id = searchParams.get('id');
  
  if (email) {
    await getSupabase()
      .from('subscribers')
      .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim());
    
    return new Response(
      '<html><body style="font-family:sans-serif;text-align:center;padding:80px;background:#1a1a2e;color:#eee">' +
      '<h1 style="color:#a855f7">✅ Te has desuscrito</h1>' +
      '<p>No recibirás más emails de La Fama.</p>' +
      '</body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  
  if (id) {
    await getSupabase()
      .from('subscribers')
      .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
      .eq('id', id);
  }
  
  return NextResponse.json({ success: true });
}