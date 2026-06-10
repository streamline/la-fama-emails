import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getResend } from '@/lib/resend';

export async function POST(request: NextRequest) {
  const { campaign_id, test_email } = await request.json();
  
  if (!campaign_id) {
    return NextResponse.json({ error: 'campaign_id is required' }, { status: 400 });
  }
  
  const { data: campaign, error: campError } = await getSupabase()
    .from('campaigns')
    .select('*')
    .eq('id', campaign_id)
    .single();
  
  if (campError || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }
  
  if (test_email) {
    const { error: sendError } = await getResend().emails.send({
      from: `${campaign.from_name} <${campaign.from_email}>`,
      to: [test_email],
      subject: `[TEST] ${campaign.subject}`,
      html: campaign.html_content,
    });
    
    if (sendError) return NextResponse.json({ error: sendError.message }, { status: 500 });
    return NextResponse.json({ sent: 1, test: true, to: test_email });
  }
  
  const { data: subscribers, error: subError } = await getSupabase()
    .from('subscribers')
    .select('id, email, name')
    .eq('status', 'active');
  
  if (subError) return NextResponse.json({ error: subError.message }, { status: 500 });
  if (!subscribers?.length) return NextResponse.json({ error: 'No active subscribers' }, { status: 400 });
  
  await getSupabase()
    .from('campaigns')
    .update({ 
      status: 'sending', 
      total_recipients: subscribers.length,
      sent_at: new Date().toISOString()
    })
    .eq('id', campaign_id);
  
  const recipientRows = subscribers.map(s => ({
    campaign_id,
    subscriber_id: s.id,
    status: 'pending'
  }));
  
  await getSupabase().from('campaign_recipients').upsert(recipientRows, {
    onConflict: 'campaign_id,subscriber_id'
  });
  
  let sent = 0;
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const emails = batch.map(s => ({
      from: `${campaign.from_name} <${campaign.from_email}>` as const,
      to: s.email,
      subject: campaign.subject,
      html: campaign.html_content,
      headers: {
        'List-Unsubscribe': `<https://lafama-emails.vercel.app/api/unsubscribe?email=${s.email}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }));
    
    const results = await Promise.allSettled(
      emails.map(e => getResend().emails.send(e))
    );
    
    const updates = batch.map((s, idx) => ({
      campaign_id,
      subscriber_id: s.id,
      status: results[idx].status === 'fulfilled' ? 'sent' : 'bounced'
    }));
    
    for (const update of updates) {
      await getSupabase()
        .from('campaign_recipients')
        .update({ status: update.status })
        .eq('campaign_id', update.campaign_id)
        .eq('subscriber_id', update.subscriber_id);
      
      if (update.status === 'sent') sent++;
    }
  }
  
  await getSupabase()
    .from('campaigns')
    .update({ status: 'sent', sent_count: sent })
    .eq('id', campaign_id);
  
  return NextResponse.json({
    sent,
    total: subscribers.length,
    campaign_id
  });
}