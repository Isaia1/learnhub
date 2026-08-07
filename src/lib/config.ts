const PLACEHOLDER_MARKERS = ['your-project', 'your-anon-key', 'example.com', 'REPLACE_ME'];

function isRealValue(value: string | undefined): boolean {
  if (!value || value.trim().length < 10) return false;
  return !PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured = Boolean(
  isRealValue(supabaseUrl) &&
    isRealValue(supabaseAnonKey) &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.startsWith('eyJ')
);

export const supabaseConfigHint = isSupabaseConfigured
  ? null
  : 'Add your real Supabase URL and anon key to the .env file, then restart with: npx expo start --clear';
