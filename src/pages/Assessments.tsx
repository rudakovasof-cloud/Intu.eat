import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAppStore } from '../store/useAppStore'
import { ASSESSMENTS, EATING_PATTERN_LABELS } from '../content/assessments'

export function Assessments() {
  const results = useAppStore((s) => s.assessmentResults)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Тесты на РПП</h1>
        <p className="text-sm text-ink-500 mt-1">
          Три коротких самоопросника — на входе, в середине и в конце курса — чтобы отслеживать динамику. Это
          инструменты самонаблюдения, а не медицинская диагностика.
        </p>
      </div>

      <div className="space-y-4">
        {ASSESSMENTS.map((a) => {
          const attempts = results.filter((r) => r.stage === a.stage).sort((x, y) => (x.completedAt < y.completedAt ? 1 : -1))
          const latest = attempts[0]
          return (
            <Link
              key={a.stage}
              to={`/tests/${a.stage}`}
              className="block bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 hover:border-sage-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-sage-600 bg-sage-50 rounded-full px-2 py-0.5">
                  {a.timingLabel}
                </span>
                {latest ? (
                  <span className="text-xs font-medium text-sage-600">
                    ✓ Пройден {format(new Date(latest.completedAt), 'd MMM yyyy', { locale: ru })}
                  </span>
                ) : (
                  <span className="text-xs text-ink-500">Не пройден</span>
                )}
              </div>
              <h2 className="font-semibold text-ink-900 mt-1">{a.title}</h2>
              <p className="text-sm text-ink-500 mt-1">{a.description}</p>
              {latest?.likertScore != null && (
                <p className="text-sm text-sage-700 mt-2 font-medium">
                  Результат шкалы: {latest.likertScore}/{latest.likertMax}
                </p>
              )}
              {latest?.eatingPattern && (
                <p className="text-sm text-clay-600 mt-1 font-medium">{EATING_PATTERN_LABELS[latest.eatingPattern]}</p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
