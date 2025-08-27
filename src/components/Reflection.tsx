import { useState } from 'react'
import { generateCandidates } from '../lib/ai'

type Props = {
  bad: string
  good: string
  improvement: string
  enhancement: string
  onChange: (next: { bad?: string; good?: string; improvement?: string; enhancement?: string }) => void
  dateLabel: string
}

export default function Reflection(props: Props) {
  const { bad, good, improvement, enhancement, onChange, dateLabel } = props
  const [loadingImprovement, setLoadingImprovement] = useState(false)
  const [loadingEnhancement, setLoadingEnhancement] = useState(false)
  const [candsImprovement, setCandsImprovement] = useState<string[]>([])
  const [candsEnhancement, setCandsEnhancement] = useState<string[]>([])

  async function onGenImprovement() {
    setLoadingImprovement(true)
    const cands = await generateCandidates(bad, 'improvement')
    setCandsImprovement(cands)
    setLoadingImprovement(false)
  }

  async function onGenEnhancement() {
    setLoadingEnhancement(true)
    const cands = await generateCandidates(good, 'enhancement')
    setCandsEnhancement(cands)
    setLoadingEnhancement(false)
  }

  return (
    <div className="page p-4 md:p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="section-title">昨日の振り返り</h2>
        <span className="text-xs text-gray-500">対象日: {dateLabel}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左カラム */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">昨日悪かったこと</div>
            <textarea
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm min-h-[92px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="事実ベースで短く（例：締切間際に着手し焦った）"
              value={bad}
              onChange={e => onChange({ bad: e.target.value })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-600">改善案</div>
              <button
                onClick={onGenImprovement}
                className="ai-badge"
                disabled={loadingImprovement}
              >{loadingImprovement ? '生成中…' : 'AI候補生成'}</button>
            </div>
            <textarea
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm min-h-[92px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="実行可能な最小ステップに分解して記述"
              value={improvement}
              onChange={e => onChange({ improvement: e.target.value })}
            />
            {candsImprovement.length > 0 && (
              <div className="mt-2 grid gap-2">
                {candsImprovement.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChange({ improvement: c })}
                    className="text-left text-xs p-2 rounded border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                    title="クリックで採用"
                  >{c}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右カラム */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">昨日良かったこと</div>
            <textarea
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm min-h-[92px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="再現可能な行動に注目（例：開始5分で集中に入れた）"
              value={good}
              onChange={e => onChange({ good: e.target.value })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-600">改良案</div>
              <button
                onClick={onGenEnhancement}
                className="ai-badge"
                disabled={loadingEnhancement}
              >{loadingEnhancement ? '生成中…' : 'AI候補生成'}</button>
            </div>
            <textarea
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm min-h-[92px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="良かった点を強化するための小さな工夫"
              value={enhancement}
              onChange={e => onChange({ enhancement: e.target.value })}
            />
            {candsEnhancement.length > 0 && (
              <div className="mt-2 grid gap-2">
                {candsEnhancement.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChange({ enhancement: c })}
                    className="text-left text-xs p-2 rounded border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                    title="クリックで採用"
                  >{c}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

