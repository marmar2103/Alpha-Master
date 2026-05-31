import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function pearsonCorrelation(a: number[], b: number[], lag = 0): number {
  const sa = a.slice(0, a.length - lag || undefined);
  const sb = b.slice(lag);
  if (sa.length < 7) return 0;
  const ma = sa.reduce((s, v) => s + v, 0) / sa.length;
  const mb = sb.reduce((s, v) => s + v, 0) / sb.length;
  const num = sa.reduce((s, v, i) => s + (v - ma) * (sb[i] - mb), 0);
  const den = Math.sqrt(sa.reduce((s, v) => s + (v - ma) ** 2, 0) * sb.reduce((s, v) => s + (v - mb) ** 2, 0));
  return den === 0 ? 0 : num / den;
}

Deno.serve(async (req: Request) => {
  const { userId } = await req.json();
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: history } = await supabase
    .from('computed_scores')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .limit(90);

  if (!history || history.length < 7) {
    return new Response(JSON.stringify({ message: 'Insufficient data' }), { headers: { 'Content-Type': 'application/json' } });
  }

  const keys = ['sleep', 'stress', 'energy', 'focus', 'mood', 'digestion', 'habit', 'hrv'];
  const results = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const sa = history.map((h: Record<string, number>) => h[`${keys[i]}_score`] ?? 50);
      const sb = history.map((h: Record<string, number>) => h[`${keys[j]}_score`] ?? 50);
      for (const lag of [0, 1, 2]) {
        const r = pearsonCorrelation(sa, sb, lag);
        if (Math.abs(r) > 0.4) {
          results.push({ user_id: userId, dimension_a: keys[i], dimension_b: keys[j], correlation_coefficient: r, lag_days: lag, data_points: history.length });
        }
      }
    }
  }

  if (results.length > 0) {
    await supabase.from('correlations').upsert(results.slice(0, 10));
  }

  return new Response(JSON.stringify({ correlations: results.length }), { headers: { 'Content-Type': 'application/json' } });
});
