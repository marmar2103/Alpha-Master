import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://esm.sh/openai@4';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

Deno.serve(async (req: Request) => {
  const { userId, insightType } = await req.json();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: scores } = await supabase
    .from('computed_scores')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(14);

  const { data: correlations } = await supabase
    .from('correlations')
    .select('*')
    .eq('user_id', userId)
    .order('computed_at', { ascending: false })
    .limit(5);

  const { data: profile } = await supabase
    .from('profiles')
    .select('persona, primary_struggle')
    .eq('id', userId)
    .single();

  const prompt = `You are a health intelligence AI called "Mirror." Analyze biometric correlations and generate precise, actionable insights.

USER PROFILE:
- Persona: ${profile?.persona}
- Primary struggle: ${profile?.primary_struggle}

LAST 14 DAYS OF SCORES (0-100 scale):
${JSON.stringify(scores, null, 2)}

TOP CORRELATIONS:
${JSON.stringify(correlations, null, 2)}

Generate ONE insight for type: "${insightType}".
Rules: Lead with surprising correlations, use specific numbers, give one concrete action, tone: intelligent and warm, max 2-3 sentences body.

Respond with JSON only:
{"title":"short title (5-7 words)","body":"insight body","action":"one action sentence","dimension":"primary dimension","priority":5}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 300,
  });

  const insight = JSON.parse(completion.choices[0].message.content!);

  await supabase.from('ai_insights').insert({
    user_id: userId,
    week_start: new Date().toISOString().split('T')[0],
    insight_type: insightType,
    title: insight.title,
    body: insight.body,
    action_text: insight.action,
    dimension: insight.dimension,
    priority: insight.priority,
  });

  return new Response(JSON.stringify(insight), {
    headers: { 'Content-Type': 'application/json' },
  });
});
