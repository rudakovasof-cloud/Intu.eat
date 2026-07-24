import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getWeek, WEEKS } from '../content/weeks'
import { useAppStore } from '../store/useAppStore'
import type { Exercise } from '../content/weeks'

function ExerciseBlock({ weekNumber, exercise }: { weekNumber: number; exercise: Exercise }) {
  const saveAnswer = useAppStore((s) => s.saveAnswer)
  const savedAnswer = useAppStore((s) => s.weekProgress[weekNumber]?.answers[exercise.id])
  const [text, setText] = useState(savedAnswer?.answer ?? '')
  const [checked, setChecked] = useState<string[]>(savedAnswer?.checkedItems ?? [])

  const persistText = (value: string) => {
    setText(value)
    saveAnswer(weekNumber, { exerciseId: exercise.id, answer: value, completedAt: new Date().toISOString() })
  }

  const toggleItem = (item: string) => {
    const next = checked.includes(item) ? checked.filter((i) => i !== item) : [...checked, item]
    setChecked(next)
    saveAnswer(weekNumber, {
      exerciseId: exercise.id,
      answer: savedAnswer?.answer ?? '',
      checkedItems: next,
      completedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 space-y-3">
      <div>
        <span className="text-xs uppercase tracking-wide text-sage-600 font-semibold">
          {exercise.type === 'checklist' ? 'Чек-лист' : exercise.type === 'practice' ? 'Практика' : 'Рефлексия'}
        </span>
        <h3 className="font-semibold text-ink-900 mt-0.5">{exercise.title}</h3>
      </div>
      <p className="text-sm text-ink-500">{exercise.prompt}</p>

      {exercise.type === 'checklist' && exercise.items ? (
        <div className="space-y-2">
          {exercise.items.map((item) => (
            <label key={item} className="flex items-start gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={checked.includes(item)}
                onChange={() => toggleItem(item)}
                className="mt-0.5 h-4 w-4 accent-sage-500"
              />
              {item}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => persistText(e.target.value)}
          placeholder={exercise.placeholder}
          rows={4}
          className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
      )}
    </div>
  )
}

export function WeekDetail() {
  const { number } = useParams()
  const weekNumber = Number(number)
  const week = getWeek(weekNumber)
  const navigate = useNavigate()
  const markWeekComplete = useAppStore((s) => s.markWeekComplete)
  const completedAt = useAppStore((s) => s.weekProgress[weekNumber]?.completedAt)

  if (!week) {
    return <p className="text-ink-500">Неделя не найдена.</p>
  }

  const prev = WEEKS.find((w) => w.number === weekNumber - 1)
  const next = WEEKS.find((w) => w.number === weekNumber + 1)

  return (
    <div className="space-y-6">
      <div>
        <Link to="/weeks" className="text-sm text-sage-600 hover:underline">
          ← Все недели
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-semibold text-sage-600 bg-sage-50 rounded-full px-2 py-0.5">
            Неделя {week.number} из {WEEKS.length}
          </span>
          <span className="text-xs text-ink-500">{week.focusTag.label}</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink-900 mt-1">{week.title}</h1>
        <p className="text-sm text-ink-500">{week.subtitle}</p>
      </div>

      <p className="text-sm leading-relaxed text-ink-700 bg-sage-50 rounded-2xl p-4 sm:p-5">{week.intro}</p>

      <div className="space-y-4">
        {week.exercises.map((ex) => (
          <ExerciseBlock key={ex.id} weekNumber={week.number} exercise={ex} />
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div>
          {prev && (
            <button onClick={() => navigate(`/weeks/${prev.number}`)} className="text-sm text-ink-500 hover:text-ink-700 mr-3">
              ← Неделя {prev.number}
            </button>
          )}
          {next && (
            <button onClick={() => navigate(`/weeks/${next.number}`)} className="text-sm text-ink-500 hover:text-ink-700">
              Неделя {next.number} →
            </button>
          )}
        </div>
        <button
          onClick={() => markWeekComplete(week.number)}
          className={`text-sm font-medium rounded-full px-5 py-2 transition-colors ${
            completedAt ? 'bg-sage-100 text-sage-700' : 'bg-sage-500 hover:bg-sage-600 text-white'
          }`}
        >
          {completedAt ? '✓ Неделя завершена' : 'Отметить неделю завершённой'}
        </button>
      </div>
    </div>
  )
}
