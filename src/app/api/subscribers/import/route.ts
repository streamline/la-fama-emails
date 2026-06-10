import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) return NextResponse.json({ error: 'CSV file required' }, { status: 400 });
  
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  let imported = 0;
  let errors = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (i === 0 && line.toLowerCase().startsWith('email')) continue;
    
    const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    const email = parts[0]?.toLowerCase();
    const name = parts[1] || null;
    
    if (!email || !email.includes('@')) { errors++; continue; }
    
    const { error } = await getSupabase()
      .from('subscribers')
      .upsert({ email, name, source: 'import' }, { onConflict: 'email' });
    
    if (error) errors++;
    else imported++;
  }
  
  return NextResponse.json({ imported, errors, total: lines.length });
}