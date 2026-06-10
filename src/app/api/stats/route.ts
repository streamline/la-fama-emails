import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const { count: totalCount } = await getSupabase()
    .from('subscribers')
    .select('*', { count: 'exact', head: true });
  
  const { count: activeCount } = await getSupabase()
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  
  const { count: campaignsCount } = await getSupabase()
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent');
  
  const { data: recentSent } = await getSupabase()
    .from('campaigns')
    .select('sent_count, total_recipients')
    .eq('status', 'sent')
    .order('created_at', { ascending: false })
    .limit(5);
  
  const totalSent = recentSent?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0;
  
  return NextResponse.json({
    total_subscribers: totalCount || 0,
    active_subscribers: activeCount || 0,
    total_campaigns_sent: campaignsCount || 0,
    total_emails_sent: totalSent,
  });
}