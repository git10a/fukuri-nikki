import { useEffect, useMemo, useState } from 'react'
import TodoList from './components/TodoList'
import Reflection from './components/Reflection'
import { DayData, dateKey, ensureDay, getYesterday, saveDay } from './lib/storage'

export default function App() {
  const today = useMemo(() => new Date(), [])
  const todayKey = dateKey(today)
  const yesterday = getYesterday(today)
  const yesterdayKey = dateKey(yesterday)

  const [todayData, setTodayData] = useState<DayData>(() => ensureDay(todayKey))
  const [yesterdayData, setYesterdayData] = useState<DayData>(() => ensureDay(yesterdayKey))

  // Autosave
  useEffect(() => { saveDay(todayKey, todayData) }, [todayKey, todayData])
  useEffect(() => { saveDay(yesterdayKey, yesterdayData) }, [yesterdayKey, yesterdayData])

  return (
    <div className="min-h-full bg-gray-50">
      <header className="px-4 md:px-6 py-3 border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-lg font-semibold">複利日記</h1>
            <p className="text-xs text-gray-500">紙の見開きのように、今日と昨日を並べて習慣化</p>
          </div>
          <div className="text-xs text-gray-500">{todayKey}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* 見開き: 980px以上は左右、未満は上下 */}
        <div className="grid gap-4 spread:grid-cols-2">
          <section>
            <TodoList
              items={todayData.todos}
              onChange={(items) => setTodayData(prev => ({ ...prev, todos: items }))}
            />
          </section>

          <section>
            <Reflection
              bad={yesterdayData.reflection.bad}
              good={yesterdayData.reflection.good}
              improvement={yesterdayData.reflection.improvement}
              enhancement={yesterdayData.reflection.enhancement}
              onChange={(next) => setYesterdayData(prev => ({
                ...prev,
                reflection: { ...prev.reflection, ...next },
              }))}
              dateLabel={yesterdayKey}
            />
          </section>
        </div>
      </main>

      <footer className="px-4 md:px-6 py-3 border-t bg-white">
        <div className="max-w-6xl mx-auto text-[11px] text-gray-500">
          投資・医療・法律は一般情報にとどめます
        </div>
      </footer>
    </div>
  )
}

