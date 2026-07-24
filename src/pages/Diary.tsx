import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAppStore } from '../store/useAppStore'
import { DiaryEntryForm } from '../components/DiaryEntryForm'
import { EATING_REASON_LABELS, type DiaryEntry } from '../types'

function EntryCard({ entry }: { entry: DiaryEntry }) {
  const deleteEntry = useAppStore((s) => s.deleteEntry)
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <DiaryEntryForm initial={entry} onDone={() => setEditing(false)} />
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-ink-900">{entry.time} · {entry.food}</div>
          {entry.context && <div className="text-xs text-ink-500 mt-0.5">{entry.context}</div>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-ink-500 hover:text-sage-600 px-2 py-1 rounded-full hover:bg-sage-50"
          >
            Изменить
          </button>
          <button
            onClick={() => deleteEntry(entry.id)}
            className="text-xs text-ink-500 hover:text-clay-600 px-2 py-1 rounded-full hover:bg-clay-100"
          >
            Удалить
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs bg-clay-100 text-clay-600 rounded-full px-2 py-0.5">Голод: {entry.hungerBefore}/10</span>
        <span className="text-xs bg-sage-100 text-sage-700 rounded-full px-2 py-0.5">Сытость: {entry.fullnessAfter}/10</span>
        <span className="text-xs bg-cream-200 text-ink-700 rounded-full px-2 py-0.5">Удовлетворение: {entry.satisfaction}/5</span>
        <span className="text-xs bg-cream-200 text-ink-700 rounded-full px-2 py-0.5">{EATING_REASON_LABELS[entry.eatingReason]}</span>
        {entry.dietRuleThought && (
          <span className="text-xs bg-clay-100 text-clay-600 rounded-full px-2 py-0.5">Диетическая мысль</span>
        )}
      </div>
      {(entry.emotionsBefore.length > 0 || entry.emotionsAfter.length > 0) && (
        <div className="text-xs text-ink-500 mt-2 space-y-0.5">
          {entry.emotionsBefore.length > 0 && <div>До еды: {entry.emotionsBefore.join(', ')}</div>}
          {entry.emotionsAfter.length > 0 && <div>После еды: {entry.emotionsAfter.join(', ')}</div>}
        </div>
      )}
      {entry.thoughts && <p className="text-sm text-ink-500 mt-2 italic">«{entry.thoughts}»</p>}
    </div>
  )
}

export function Diary() {
  const entries = useAppStore((s) => s.entries)
  const [showForm, setShowForm] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map<string, DiaryEntry[]>()
    for (const e of entries) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [entries])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Дневник питания</h1>
          <p className="text-sm text-ink-500 mt-1">Голод, сытость, эмоции и мысли — без подсчёта калорий.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-full px-4 py-2 shrink-0"
          >
            + Новая запись
          </button>
        )}
      </div>

      {showForm && <DiaryEntryForm onDone={() => setShowForm(false)} />}

      {grouped.length === 0 && !showForm && (
        <div className="text-center py-16 text-ink-500">
          <p>Записей пока нет.</p>
          <p className="text-sm mt-1">Добавьте первую запись, чтобы начать наблюдать за своими паттернами питания.</p>
        </div>
      )}

      <div className="space-y-6">
        {grouped.map(([date, dayEntries]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">
              {format(parseISO(date), 'EEEE, d MMMM', { locale: ru })}
            </h2>
            <div className="space-y-3">
              {dayEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
