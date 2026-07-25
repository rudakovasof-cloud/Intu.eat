import { useState } from 'react'
import { PRACTICES } from '../content/practices'
import { useAppStore } from '../store/useAppStore'

function PracticeCard({ practice }: { practice: (typeof PRACTICES)[number] }) {
  const [open, setOpen] = useState(false)
  const savedAnswer = useAppStore((s) => s.practiceAnswers[practice.id])
  const savePracticeAnswer = useAppStore((s) => s.savePracticeAnswer)
  const [text, setText] = useState(savedAnswer?.answer ?? '')

  const persist = (value: string) => {
    setText(value)
    savePracticeAnswer({ exerciseId: practice.id, answer: value, completedAt: new Date().toISOString() })
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-sage-600 bg-sage-50 rounded-full px-2 py-0.5">{practice.category}</span>
            <span className="text-xs text-ink-500">{practice.duration}</span>
            {savedAnswer?.answer && <span className="text-xs text-sage-600">✓ Есть заметки</span>}
          </div>
          <h3 className="font-semibold text-ink-900 mt-1">{practice.title}</h3>
        </div>
        <span className="text-ink-500 shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-3">
          <p className="text-sm text-ink-700 leading-relaxed">{practice.instructions}</p>
          <div>
            <label className="text-sm font-medium text-ink-700 block mb-1">{practice.prompt}</label>
            <textarea
              value={text}
              onChange={(e) => persist(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function Practices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Дополнительные практики</h1>
        <p className="text-sm text-ink-500 mt-1">
          Практики на нормализацию отношений с едой и телом — не привязаны к неделям курса, возвращайтесь к ним в
          любое время.
        </p>
      </div>
      <div className="space-y-3">
        {PRACTICES.map((p) => (
          <PracticeCard key={p.id} practice={p} />
        ))}
      </div>
    </div>
  )
}
