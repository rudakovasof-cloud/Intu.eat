import { Link } from 'react-router-dom'
import { WEEKS } from '../content/weeks'
import { useAppStore } from '../store/useAppStore'

export function WeeksList() {
  const weekProgress = useAppStore((s) => s.weekProgress)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Курс упражнений по неделям</h1>
        <p className="text-sm text-ink-500 mt-1">
          10 недель, основанные на принципах интуитивного питания. Проходите в своём темпе — неделя может занять больше
          семи дней, это нормально.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {WEEKS.map((week) => {
          const progress = weekProgress[week.number]
          const answered = progress ? Object.keys(progress.answers).length : 0
          const total = week.exercises.length
          const done = progress?.completedAt != null
          return (
            <Link
              key={week.number}
              to={`/weeks/${week.number}`}
              className="bg-white rounded-2xl border border-cream-200 p-4 hover:border-sage-300 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sage-600 bg-sage-50 rounded-full px-2 py-0.5">
                  Неделя {week.number}
                </span>
                {done ? (
                  <span className="text-xs font-medium text-sage-600">✓ Завершена</span>
                ) : (
                  answered > 0 && <span className="text-xs text-ink-500">{answered}/{total} упражнений</span>
                )}
              </div>
              <h2 className="font-semibold text-ink-900">{week.title}</h2>
              <p className="text-sm text-ink-500">{week.subtitle}</p>
              <div className="h-1.5 bg-cream-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-sage-400 rounded-full"
                  style={{ width: `${done ? 100 : Math.round((answered / total) * 100)}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
