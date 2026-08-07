#!/usr/bin/env node
/**
 * Verifies Supabase connection and that the database schema is applied.
 * Usage: node scripts/verify-supabase.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error('Missing .env file. Copy .env.example to .env and add your Supabase keys.');
    process.exit(1);
  }
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

loadEnv();

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url?.startsWith('https://') || !key?.startsWith('eyJ')) {
  console.error('Invalid Supabase keys in .env. URL must start with https:// and anon key with eyJ');
  process.exit(1);
}

const headers = { apikey: key, Authorization: `Bearer ${key}` };

console.log('Checking Supabase connection...');
const health = await fetch(`${url}/rest/v1/courses?select=id&limit=1`, { headers });
if (!health.ok) {
  console.error(`Failed to reach Supabase (${health.status}). Check URL and anon key.`);
  process.exit(1);
}

const courses = await health.json();
if (!Array.isArray(courses)) {
  console.error('Unexpected response from Supabase.');
  process.exit(1);
}

if (courses.length === 0) {
  console.warn('Connected, but no courses found. Run supabase/schema.sql in the SQL Editor.');
} else {
  console.log(`Connected. Found ${courses.length}+ course(s) in database.`);
}

console.log('Supabase is ready for LearnHub.');
