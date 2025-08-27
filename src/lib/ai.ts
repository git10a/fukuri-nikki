type CandidateType = 'improvement' | 'enhancement';

function fallbackCandidates(input: string, type: CandidateType): string[] {
  const base = input.trim() || (type === 'improvement' ? '時間管理' : '習慣の継続');
  if (type === 'improvement') {
    return [
      `トリガーを特定し、${base}の直前に5分タイマーで着手`,
      `失敗条件を減らす：${base}の手順を3ステップに簡略化`,
      `IF-THENルール化「朝食後に${base}を15分」`,
    ];
  }
  return [
    `${base}を習慣化：同時刻・同場所で固定化`,
    `${base}を仕組み化：チェックリスト化して再現性UP`,
    `${base}を可視化：進捗を日次で記録・週次で振り返り`,
  ];
}

function extractTextFromResponsesApi(data: any): string | null {
  // Try various shapes from Responses API or Chat Completions
  if (!data) return null;
  if (typeof data.output_text === 'string') return data.output_text;
  if (Array.isArray(data.output)) {
    const first = data.output.find((c: any) => c?.content)?.content?.[0];
    if (first?.type === 'output_text' && typeof first.text === 'string') return first.text;
  }
  if (Array.isArray(data.choices) && data.choices[0]?.message?.content) {
    return data.choices[0].message.content as string;
  }
  if (typeof data.text === 'string') return data.text;
  return null;
}

export async function generateCandidates(input: string, type: CandidateType): Promise<string[]> {
  // サーバ側（Cloudflare Pages Functions）のプロキシを呼ぶ。
  try {
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const cands = Array.isArray(data?.candidates) ? data.candidates.map(String).slice(0, 3) : [];
    return cands.length ? cands : fallbackCandidates(input, type);
  } catch {
    return fallbackCandidates(input, type);
  }
}
