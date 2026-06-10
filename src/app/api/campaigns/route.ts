import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await getSupabase()
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { subject, from_name, from_email, html_content } = body;
  
  if (!subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
  
  const { data, error } = await getSupabase()
    .from('campaigns')
    .insert({
      subject,
      from_name: from_name || 'La Fama',
      from_email: from_email || 'info@lafamabarber.com',
      html_content: html_content || '',
      status: 'draft'
    })
    .select()
    .single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaign: data });
}