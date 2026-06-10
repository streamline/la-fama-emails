import { createClient } from '@supabase/supabase-js';

export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  created_at: string;
};

export type Campaign = {
  id: string;
  subject: string;
  from_name: string;
  from_email: string;
  html_content: string;
  status: 'draft' | 'sent' | 'sending';
  total_recipients?: number;
  sent_count?: number;
  created_at: string;
  sent_at?: string;
};

export type CampaignStats = {
  campaign_id: string;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
};

export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}