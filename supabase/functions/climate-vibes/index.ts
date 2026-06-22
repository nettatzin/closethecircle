import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Body {
  lang?: 'en' | 'he';
  draws?: string[];
  energy?: string[];
  locationFormat?: string[];
  digitalReach?: string[];
  artworkCount?: number;
  activityCount?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: Body = await req.json().catch(() => ({}));
    const lang = body.lang === 'he' ? 'he' : 'en';

    const summary = [
      body.draws?.length ? `draws: ${body.draws.join(', ')}` : null,
      body.energy?.length ? `energy/commitment: ${body.energy.join(', ')}` : null,
      body.locationFormat?.length ? `format: ${body.locationFormat.join(', ')}` : null,
      body.digitalReach?.length ? `reach: ${body.digitalReach.join(', ')}` : null,
      body.artworkCount ? `${body.artworkCount} artworks resonated` : null,
      body.activityCount != null ? `${body.activityCount} activities matched` : null,
    ].filter(Boolean).join(' | ') || 'no specific preferences yet';

    const systemPrompt = lang === 'he'
      ? 'אתה כותב משפט אחד קצר, חם ומעורר השראה (עד 18 מילים) בעברית, בגוף שני יחיד, שמתאר את "הוייב הסביבתי" של המשתמש בהתבסס על ההעדפות שלו לפעילות אקלים ועיצוב מעגלי. בלי קלישאות, בלי אימוג\'ים, בלי מירכאות. רק משפט אחד.'
      : 'You write a single short, warm, evocative sentence (max 18 words) describing the user\'s "climate vibe" based on their preferences for circular-design and climate activities. Second person, no clichés, no emojis, no quotes. One sentence only.';

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `User preferences: ${summary}` },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: 'AI gateway error', status: resp.status, detail: text }), {
        status: resp.status === 429 || resp.status === 402 ? resp.status : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const vibe = data?.choices?.[0]?.message?.content?.trim() || '';

    return new Response(JSON.stringify({ vibe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
