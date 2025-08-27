export const onRequestPost: PagesFunction<{ OPENAI_API_KEY: string }> = async (context) => {
  const { request, env } = context
  try {
    const { input, type } = await request.json<{ input: string; type: 'improvement' | 'enhancement' }>()
    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ candidates: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const prompt = `日本語で簡潔に。次の出来事を踏まえ、$${type === 'improvement' ? '改善案' : '改良案'}$を3件、JSON配列(["…"])のみで出力：\n出来事: ${
      (input || '').trim() || '—'
    }`

    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'codex-mini-latest',
        input: prompt,
        max_output_tokens: 400,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `OpenAI HTTP ${res.status}` }), { status: 502 })
    }
    const data = await res.json<any>()

    function extractTextFromResponsesApi(x: any): string | null {
      if (!x) return null
      if (typeof x.output_text === 'string') return x.output_text
      if (Array.isArray(x.output)) {
        const first = x.output.find((c: any) => c?.content)?.content?.[0]
        if (first?.type === 'output_text' && typeof first.text === 'string') return first.text
      }
      if (Array.isArray(x.choices) && x.choices[0]?.message?.content) return x.choices[0].message.content
      if (typeof x.text === 'string') return x.text
      return null
    }

    const text = extractTextFromResponsesApi(data) ?? ''
    let candidates: string[] = []
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) candidates = parsed.map(String).slice(0, 3)
    } catch {}
    if (candidates.length === 0) {
      candidates = text
        .split(/\r?\n/)
        .map((s: string) => s.replace(/^\s*[-*\d.）)]+\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 3)
    }

    return new Response(JSON.stringify({ candidates }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Bad Request' }), { status: 400 })
  }
}

