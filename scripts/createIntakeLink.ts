// scripts/createIntakeLink.ts
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export async function createIntakeLink(clientName: string, clientEmail: string) {
  const token = crypto.randomBytes(32).toString('hex'); // 64-char random token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await admin
    .from('intake_links')
    .insert({
      token,
      client_name: clientName,
      client_email: clientEmail,
      expires_at: expiresAt,
    });

  if (error) throw error;

  const link = `https://secure.solas.travel/intake.html?token=${token}`;
  return link;
}