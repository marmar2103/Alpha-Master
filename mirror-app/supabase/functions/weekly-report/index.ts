import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://esm.sh/openai@4';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

Deno.serve(async (req: Request) => {
  const { userId } = await req.json();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [{ data: scores }, { data: checkins }, { data: correlations }, { data: profile }] = await Promise.all([
    supabase.from('computed_scores').select('*').eq('user_id', userId).gte('date', weekAgo.toISOString().split('T')[0]).order('date'),
    supabase.from('daily_checkins').select('*').eq('user_id', userId).gte('date', weekAgo.toISOString().split('T')[0]).order('date'),
    supabase.from('correlations').select('*').eq('user_id', userId).order('computed_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('persona, primary_struggle, display_name').eq('id', userId).single(),
  ]);

  const avgMirror = scores && scores.length > 0
    ? Math.round(scores.reduce((a: number, s: any) => a + (s.mirror_score ?? 0), 0) / scores.length)
    : null;

  const prompt = `You are Mirror, an AI health coach. Generate a weekly health report.

USER: ${profile?.display_name ?? 'User'} (${profile?.persona}, struggling with: ${profile?.primary_struggle})
WEEK AVG MIRROR SCORE: ${avgMirror ?? 'N/A'}
DAILY SCORES: ${JSON.stringify(scores?.map((s: any) => ({ date: s.date, mirror: s.mirror_score, sleep: s.sleep_score, stress: s.stress_score })))}
TOP CORRELATIONS: ${JSON.stringify(correlations)}

Write a weekly report with:
1. Overall week summary (1 sentence with the average score and trend)
2. Top win of the week (specific data point)
3. Biggest opportunity (what to focus on next week)
4. One surprising correlation found

Respond JSON: {"title":"Weekly Report: [date range]","summary":"...","top_win":"...","opportunity":"...","correlation_insight":"...","action":"one concrete action for next week"}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 400,
  });

  const report = JSON.parse(completion.choices[0].message.content!);

  const weekStart = weekAgo.toISOString().split('T')[0];
  await supabase.from('ai_insights').insert({
    user_id: userId,
    week_start: weekStart,
    insight_type: 'weekly',
    dimension: 'mirror',
    title: report.title,
    body: `${report.summary} ${report.top_win} ${report.correlation_insight}`,
    action_text: report.action,
    priority: 9,
  });

  return new Response(JSON.stringify(report), {
    headers: { 'Content-Type': 'application/json' },
  });
});
