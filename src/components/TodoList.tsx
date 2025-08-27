import { useEffect, useMemo, useState } from 'react'
import type { TodoItem } from '../lib/storage'

type Props = {
  items: TodoItem[]
  onChange: (items: TodoItem[]) => void
}

export default function TodoList({ items, onChange }: Props) {
  const [text, setText] = useState('')

  const remaining = useMemo(() => items.filter(i => !i.done).length, [items])

  function addItem() {
    const t = text.trim()
    if (!t) return
    const item: TodoItem = { id: crypto.randomUUID(), text: t, done: false }
    onChange([item, ...items])
    setText('')
  }

  function toggle(id: string) {
    onChange(items.map(i => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  function remove(id: string) {
    onChange(items.filter(i => i.id !== id))
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        addItem()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [text, items])

  return (
    <div className="page p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">今日のToDo</h2>
        <span className="text-xs text-gray-500">残り {remaining}</span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="新しいタスクを入力 (Cmd/Ctrl + Enterで追加)"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
              addItem()
            }
          }}
        />
        <button
          onClick={addItem}
          className="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >追加</button>
      </div>

      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-2 p-2 rounded border border-gray-200">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item.id)}
              className="h-4 w-4"
            />
            <span className={`flex-1 text-sm ${item.done ? 'line-through text-gray-400' : ''}`}>{item.text}</span>
            <button
              onClick={() => remove(item.id)}
              className="text-xs text-gray-500 hover:text-red-600"
              aria-label="削除"
            >削除</button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-gray-400">タスクはまだありません。</li>
        )}
      </ul>
    </div>
  )
}

