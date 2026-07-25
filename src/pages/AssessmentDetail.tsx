import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAppStore } from '../store/useAppStore'
import {
  ASSESSMENTS,
  computeLikertScore,
  computeScoffScore,
  interpretLikertScore,
  interpretScoffScore,
  LIKERT_ITEMS,
  LIKERT_MAX,
  LIKERT_SCALE_LABELS,
  SCOFF_QUESTIONS,
} from '../content/assessments'
import type { AssessmentResult, AssessmentStage } from '../types'

export function AssessmentDetail() {
  const { stage } = useParams<{ stage: string }>()
  const def = ASSESSMENTS.find((a) => a.stage === stage)
  const navigate = useNavigate()
  const saveAssessmentResult = useAppStore((s) => s.saveAssessmentResult)
  const allResults = useAppStore((s) => s.assessmentResults)

  const [scoffAnswers, setScoffAnswers] = useState<Record<string, boolean>>({})
  const [likertAnswers, setLikertAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const previousAttempts = useMemo(
    () => allResults.filter((r) => r.stage === stage).sort((x, y) => (x.completedAt < y.completedAt ? 1 : -1)),
    [allResults, stage],
  )

  const otherLikertHistory = useMemo(() => {
    const order: AssessmentStage[] = ['intake', 'midpoint', 'final']
    return order
      .map((s) => {
        const latest = allResults.filter((r) => r.stage === s && r.likertScore != null).sort((x, y) => (x.completedAt < y.completedAt ? 1 : -1))[0]
        return latest ? { stage: s, score: latest.likertScore! } : null
      })
      .filter(Boolean) as { stage: AssessmentStage; score: number }[]
  }, [allResults])

  if (!def) {
    return <p className="text-ink-500">Тест не найден.</p>
  }

  const scoffComplete = !def.includeScoff || SCOFF_QUESTIONS.every((q) => scoffAnswers[q.id] !== undefined)
  const likertComplete = !def.includeLikert || LIKERT_ITEMS.every((item) => likertAnswers[item.id] !== undefined)
  const canSubmit = scoffComplete && likertComplete

  const submit = () => {
    if (!canSubmit) return
    saveAssessmentResult({
      stage: def.stage,
      completedAt: new Date().toISOString(),
      scoffAnswers: def.includeScoff ? scoffAnswers : undefined,
      scoffScore: def.includeScoff ? computeScoffScore(scoffAnswers) : undefined,
      likertAnswers: def.includeLikert ? likertAnswers : undefined,
      likertScore: def.includeLikert ? computeLikertScore(likertAnswers) : undefined,
      likertMax: def.includeLikert ? LIKERT_MAX : undefined,
    })
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/tests" className="text-sm text-sage-600 hover:underline">
          ← Все тесты
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-semibold text-sage-600 bg-sage-50 rounded-full px-2 py-0.5">{def.timingLabel}</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink-900 mt-1">{def.title}</h1>
        <p className="text-sm text-ink-500">{def.description}</p>
      </div>

      {!submitted && (
        <>
          {def.includeScoff && (
            <div className="bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 space-y-4">
              <h2 className="font-semibold text-ink-900">Опросник SCOFF</h2>
              <p className="text-xs text-ink-500">Отвечайте да/нет, ориентируясь на последние несколько месяцев.</p>
              {SCOFF_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="text-sm text-ink-700 mb-1.5">{q.text}</p>
                  <div className="flex gap-2">
                    {[
                      { v: true, label: 'Да' },
                      { v: false, label: 'Нет' },
                    ].map((opt) => (
                      <button
                        key={String(opt.v)}
                        type="button"
                        onClick={() => setScoffAnswers((a) => ({ ...a, [q.id]: opt.v }))}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          scoffAnswers[q.id] === opt.v
                            ? 'bg-clay-500 border-clay-500 text-white'
                            : 'bg-white border-cream-200 text-ink-500 hover:border-clay-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {def.includeLikert && (
            <div className="bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 space-y-4">
              <h2 className="font-semibold text-ink-900">Шкала отношений с едой</h2>
              <p className="text-xs text-ink-500">Насколько каждое утверждение про вас сейчас — от 1 до 5.</p>
              {LIKERT_ITEMS.map((item) => (
                <div key={item.id}>
                  <p className="text-sm text-ink-700 mb-1.5">{item.text}</p>
                  <div className="flex gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        title={LIKERT_SCALE_LABELS[n - 1]}
                        onClick={() => setLikertAnswers((a) => ({ ...a, [item.id]: n }))}
                        className={`h-9 w-9 rounded-lg border text-sm transition-colors ${
                          likertAnswers[item.id] === n
                            ? 'bg-sage-400 border-sage-400 text-white'
                            : 'bg-white border-cream-200 text-ink-500'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={submit}
            disabled={!canSubmit}
            className="bg-sage-500 hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full px-5 py-2"
          >
            Завершить тест
          </button>
        </>
      )}

      {submitted && previousAttempts[0] && (
        <ResultView
          result={previousAttempts[0]}
          history={otherLikertHistory}
          onRetake={() => {
            setSubmitted(false)
            setScoffAnswers({})
            setLikertAnswers({})
          }}
        />
      )}

      {!submitted && previousAttempts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">Предыдущие попытки</h2>
          <div className="space-y-2">
            {previousAttempts.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-cream-200 p-3 text-sm text-ink-700 flex justify-between">
                <span>{format(new Date(r.completedAt), 'd MMMM yyyy, HH:mm', { locale: ru })}</span>
                <span className="text-ink-500">
                  {r.likertScore != null && `Шкала: ${r.likertScore}/${r.likertMax}`}
                  {r.scoffScore != null && `${r.likertScore != null ? ' · ' : ''}SCOFF: ${r.scoffScore}/5`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => navigate('/tests')} className="text-sm text-ink-500 hover:text-ink-700">
        ← Вернуться к списку тестов
      </button>
    </div>
  )
}

function ResultView({
  result,
  history,
  onRetake,
}: {
  result: AssessmentResult
  history: { stage: AssessmentStage; score: number }[]
  onRetake: () => void
}) {
  const r = result
  const stageLabel: Record<AssessmentStage, string> = { intake: 'Вход', midpoint: 'Середина', final: 'Финал' }

  return (
    <div className="bg-sage-50 rounded-2xl p-4 sm:p-5 space-y-4">
      <h2 className="font-semibold text-ink-900">Результат</h2>
      {r.scoffScore != null && (
        <div>
          <p className="text-sm font-medium text-ink-700">SCOFF: {r.scoffScore}/5</p>
          <p className="text-sm text-ink-500 mt-1">{interpretScoffScore(r.scoffScore)}</p>
        </div>
      )}
      {r.likertScore != null && (
        <div>
          <p className="text-sm font-medium text-ink-700">
            Шкала отношений с едой: {r.likertScore}/{r.likertMax}
          </p>
          <p className="text-sm text-ink-500 mt-1">{interpretLikertScore(r.likertScore)}</p>
        </div>
      )}

      {history.length > 1 && (
        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">Динамика по шкале</p>
          <div className="space-y-1.5">
            {history.map((h) => (
              <div key={h.stage} className="flex items-center gap-2">
                <span className="text-xs text-ink-500 w-16 shrink-0">{stageLabel[h.stage]}</span>
                <div className="flex-1 h-3 bg-cream-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sage-400 rounded-full" style={{ width: `${(h.score / LIKERT_MAX) * 100}%` }} />
                </div>
                <span className="text-xs text-ink-700 w-10 text-right shrink-0">{h.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-ink-500">
        Это инструменты самонаблюдения, а не медицинская диагностика. При тревожных результатах — особенно по
        SCOFF — хорошая идея обсудить их со специалистом по РПП.
      </p>

      <button onClick={onRetake} className="text-sm text-sage-600 hover:underline">
        Пройти тест заново
      </button>
    </div>
  )
}
