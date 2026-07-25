import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useAppStore } from '../store/useAppStore'
import { WEEKS } from '../content/weeks'
import { entriesInRange, getIsoWeekRange } from '../lib/analysis'
import { ASSESSMENTS } from '../content/assessments'
import type { AssessmentStage } from '../types'

export function Home() {
  const entries = useAppStore((s) => s.entries)
  const weekProgress = useAppStore((s) => s.weekProgress)
  const assessmentResults = useAppStore((s) => s.assessmentResults)

  const range = getIsoWeekRange(new Date())
  const weekEntries = entriesInRange(entries, range)

  const currentWeek = WEEKS.find((w) => !weekProgress[w.number]?.completedAt) ?? WEEKS[WEEKS.length - 1]

  const hasResult = (stage: AssessmentStage) => assessmentResults.some((r) => r.stage === stage)
  const week5Done = !!weekProgress[5]?.completedAt
  const week10Done = !!weekProgress[10]?.completedAt
  let nextAssessment: { stage: AssessmentStage; reason: string } | null = null
  if (!hasResult('intake')) nextAssessment = { stage: 'intake', reason: 'Пройдите короткий входной тест перед началом курса.' }
  else if (week5Done && !hasResult('midpoint'))
    nextAssessment = { stage: 'midpoint', reason: 'Неделя 5 завершена — самое время пройти промежуточный тест.' }
  else if (week10Done && !hasResult('final'))
    nextAssessment = { stage: 'final', reason: 'Курс завершён — пройдите итоговый тест, чтобы увидеть динамику.' }

  return (
    <div className="space-y-8">
      <section className="text-center py-6 sm:py-10">
        <span className="text-4xl" aria-hidden>
          🌿
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900 mt-3">Рабочая тетрадь интуитивного питания</h1>
        <p className="text-ink-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
          Дневник питания, курс упражнений по неделям и еженедельный анализ паттернов — в подходе, вдохновлённом
          методом интуитивного питания (Элиз Реш, Эвелин Триболе) и его адаптацией Светланой Бронниковой для
          русскоязычного контекста. Без подсчёта калорий и веса.
        </p>
      </section>

      {nextAssessment && (
        <Link
          to={`/tests/${nextAssessment.stage}`}
          className="block bg-clay-100 rounded-2xl p-4 hover:brightness-95 transition-all"
        >
          <p className="text-sm font-medium text-clay-600">
            {ASSESSMENTS.find((a) => a.stage === nextAssessment!.stage)?.title} →
          </p>
          <p className="text-sm text-ink-700 mt-0.5">{nextAssessment.reason}</p>
        </Link>
      )}

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-cream-200 p-4 text-center">
          <div className="text-2xl font-semibold text-sage-600">{entries.length}</div>
          <div className="text-xs text-ink-500 mt-1">записей в дневнике всего</div>
        </div>
        <div className="bg-white rounded-2xl border border-cream-200 p-4 text-center">
          <div className="text-2xl font-semibold text-sage-600">{weekEntries.length}</div>
          <div className="text-xs text-ink-500 mt-1">записей на этой неделе</div>
        </div>
        <div className="bg-white rounded-2xl border border-cream-200 p-4 text-center">
          <div className="text-2xl font-semibold text-sage-600">
            {Object.values(weekProgress).filter((w) => w.completedAt).length}/{WEEKS.length}
          </div>
          <div className="text-xs text-ink-500 mt-1">недель курса завершено</div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/diary"
          className="bg-clay-100 rounded-2xl p-5 hover:brightness-95 transition-all flex flex-col justify-between min-h-32"
        >
          <div>
            <h2 className="font-semibold text-ink-900">Дневник питания</h2>
            <p className="text-sm text-ink-500 mt-1">Отметить голод, сытость, эмоции и мысли о еде сегодня.</p>
          </div>
          <span className="text-sm text-clay-600 font-medium mt-3">Открыть дневник →</span>
        </Link>

        <Link
          to={`/weeks/${currentWeek.number}`}
          className="bg-sage-100 rounded-2xl p-5 hover:brightness-95 transition-all flex flex-col justify-between min-h-32"
        >
          <div>
            <span className="text-xs font-semibold text-sage-700">Неделя {currentWeek.number}</span>
            <h2 className="font-semibold text-ink-900">{currentWeek.title}</h2>
            <p className="text-sm text-ink-500 mt-1">{currentWeek.subtitle}</p>
          </div>
          <span className="text-sm text-sage-700 font-medium mt-3">Продолжить курс →</span>
        </Link>

        <Link
          to="/practices"
          className="bg-cream-200 rounded-2xl p-5 hover:brightness-95 transition-all flex flex-col justify-between min-h-32"
        >
          <div>
            <h2 className="font-semibold text-ink-900">Дополнительные практики</h2>
            <p className="text-sm text-ink-500 mt-1">Практики на нормализацию отношений с едой и телом — в любое время.</p>
          </div>
          <span className="text-sm text-ink-700 font-medium mt-3">Открыть практики →</span>
        </Link>

        <Link
          to="/tests"
          className="bg-cream-200 rounded-2xl p-5 hover:brightness-95 transition-all flex flex-col justify-between min-h-32"
        >
          <div>
            <h2 className="font-semibold text-ink-900">Тесты на РПП</h2>
            <p className="text-sm text-ink-500 mt-1">Входной, промежуточный и итоговый тест — отследить динамику.</p>
          </div>
          <span className="text-sm text-ink-700 font-medium mt-3">Открыть тесты →</span>
        </Link>
      </section>

      <section className="bg-white rounded-2xl border border-cream-200 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">Отчёт за текущую неделю</h2>
          <Link to="/reports" className="text-sm text-sage-600 hover:underline">
            Все отчёты →
          </Link>
        </div>
        <p className="text-sm text-ink-500 mt-1">
          {format(range.start, 'd.MM')} — {format(range.end, 'd.MM')}: {weekEntries.length} записей в дневнике.{' '}
          {weekEntries.length > 0
            ? 'Загляните в раздел «Отчёты», чтобы сформировать анализ паттернов за эту неделю.'
            : 'Добавьте записи в дневник, чтобы в конце недели получить анализ паттернов питания.'}
        </p>
      </section>
    </div>
  )
}
