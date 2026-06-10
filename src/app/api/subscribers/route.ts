import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  
  let query = getSupabase()
    .from('subscribers')
    .select('*', { count: 'exact' });
  
  if (status) query = query.eq('status', status);
  if (search) query = query.ilike('email', `%${search}%`);
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ subscribers: data, total: count, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name } = body;
  
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  
  const { data, error } = await getSupabase()
    .from('subscribers')
    .upsert({ email: email.toLowerCase().trim(), name }, { onConflict: 'email' })
    .select()
    .single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ subscriber: data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
  
  const { error } = await getSupabase().from('subscribers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}