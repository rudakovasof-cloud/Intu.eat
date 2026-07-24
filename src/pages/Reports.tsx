import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAppStore } from '../store/useAppStore'
import { WEEKS } from '../content/weeks'
import { entriesInRange, generateWeeklyReportText, getIsoWeekRange } from '../lib/analysis'

export function Reports() {
  const entries = useAppStore((s) => s.entries)
  const reports = useAppStore((s) => s.reports)
  const saveReport = useAppStore((s) => s.saveReport)
  const deleteReport = useAppStore((s) => s.deleteReport)

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [courseWeek, setCourseWeek] = useState<string>('')
  const [preview, setPreview] = useState<string | null>(null)

  const range = useMemo(() => getIsoWeekRange(new Date(selectedDate)), [selectedDate])
  const rangeEntries = useMemo(() => entriesInRange(entries, range), [entries, range])

  const generate = () => {
    const weekNumber = courseWeek ? Number(courseWeek) : null
    const weekFocusLabel = weekNumber ? WEEKS.find((w) => w.number === weekNumber)?.focusTag.label : undefined
    const text = generateWeeklyReportText(rangeEntries, range, { weekNumber, weekFocusLabel })
    setPreview(text)
    saveReport({
      weekNumber,
      rangeStart: range.start.toISOString(),
      rangeEnd: range.end.toISOString(),
      generatedAt: new Date().toISOString(),
      entryCount: rangeEntries.length,
      reportText: text,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Еженедельные отчёты</h1>
        <p className="text-sm text-ink-500 mt-1">
          Анализ паттернов питания за неделю: голод и сытость, эмоции, диетическое мышление, удовлетворение.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-700 block mb-1">Любая дата на нужной неделе</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 block mb-1">Связать с неделей курса (необязательно)</label>
            <select
              value={courseWeek}
              onChange={(e) => setCourseWeek(e.target.value)}
              className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
            >
              <option value="">Не привязывать</option>
              {WEEKS.map((w) => (
                <option key={w.number} value={w.number}>
                  Неделя {w.number} — {w.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-ink-500">
          Период: {format(range.start, 'd MMMM', { locale: ru })} — {format(range.end, 'd MMMM', { locale: ru })} ·{' '}
          {rangeEntries.length} записей в дневнике
        </p>
        <button
          onClick={generate}
          className="bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-full px-5 py-2"
        >
          Сформировать отчёт
        </button>
      </div>

      {preview && (
        <div className="bg-sage-50 rounded-2xl p-4 sm:p-5">
          <pre className="whitespace-pre-wrap font-sans text-sm text-ink-700 leading-relaxed">{preview}</pre>
        </div>
      )}

      {reports.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-2">История отчётов</h2>
          <div className="space-y-3">
            {reports.map((r) => (
              <details key={r.id} className="bg-white rounded-2xl border border-cream-200 p-4">
                <summary className="cursor-pointer flex items-center justify-between gap-3 text-sm font-medium text-ink-900">
                  <span>
                    {format(new Date(r.rangeStart), 'd MMM', { locale: ru })} —{' '}
                    {format(new Date(r.rangeEnd), 'd MMM yyyy', { locale: ru })}
                    {r.weekNumber ? ` · неделя курса ${r.weekNumber}` : ''} · {r.entryCount} записей
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      deleteReport(r.id)
                    }}
                    className="text-xs text-ink-500 hover:text-clay-600 shrink-0"
                  >
                    Удалить
                  </button>
                </summary>
                <pre className="whitespace-pre-wrap font-sans text-sm text-ink-700 leading-relaxed mt-3">{r.reportText}</pre>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
