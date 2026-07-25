import { useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { clearAllData, exportBackup, importBackup } from '../lib/backup'

export function DataSettings() {
  const entries = useAppStore((s) => s.entries)
  const reports = useAppStore((s) => s.reports)
  const assessmentResults = useAppStore((s) => s.assessmentResults)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const confirmed = window.confirm(
      'Импорт заменит текущие данные приложения содержимым файла. Продолжить?',
    )
    if (!confirmed) return
    const text = await file.text()
    const result = importBackup(text)
    setMessage(
      result.ok
        ? { type: 'ok', text: `Готово: импортировано записей дневника — ${result.entryCount}.` }
        : { type: 'error', text: result.error ?? 'Не удалось импортировать файл.' },
    )
  }

  const handleClear = () => {
    const confirmed = window.confirm(
      'Это удалит все записи дневника, прогресс курса, отчёты и результаты тестов из этого браузера без возможности восстановления (если не сохранён экспорт). Продолжить?',
    )
    if (!confirmed) return
    clearAllData()
    setMessage({ type: 'ok', text: 'Все данные очищены.' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Данные</h1>
        <p className="text-sm text-ink-500 mt-1">
          Все записи хранятся только в этом браузере (localStorage) — ничего не отправляется на сервер. Сделайте
          резервную копию, чтобы не потерять данные при смене устройства или очистке браузера.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-cream-200 p-4 text-center">
          <div className="text-2xl font-semibold text-sage-600">{entries.length}</div>
          <div className="text-xs text-ink-500 mt-1">записей дневника</div>
        </div>
        <div className="bg-white rounded-2xl border border-cream-200 p-4 text-center">
          <div className="text-2xl font-semibold text-sage-600">{reports.length}</div>
          <div className="text-xs text-ink-500 mt-1">сохранённых отчётов</div>
        </div>
        <div className="bg-white rounded-2xl border border-cream-200 p-4 text-center">
          <div className="text-2xl font-semibold text-sage-600">{assessmentResults.length}</div>
          <div className="text-xs text-ink-500 mt-1">пройденных тестов</div>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm rounded-xl p-3 ${
            message.type === 'ok' ? 'bg-sage-50 text-sage-700' : 'bg-clay-100 text-clay-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-cream-200 p-5 space-y-3">
        <h2 className="font-semibold text-ink-900">Резервная копия</h2>
        <p className="text-sm text-ink-500">
          Экспорт сохранит дневник, прогресс курса, практики, отчёты и результаты тестов в один JSON-файл. Импорт —
          загрузит данные из ранее сохранённого файла (полностью заменит текущие данные в этом браузере).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportBackup}
            className="bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-full px-5 py-2"
          >
            Скачать резервную копию
          </button>
          <button
            onClick={handleImportClick}
            className="bg-cream-200 hover:bg-cream-200/70 text-ink-700 text-sm font-medium rounded-full px-5 py-2"
          >
            Загрузить из файла
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-clay-300 p-5 space-y-3">
        <h2 className="font-semibold text-ink-900">Очистить все данные</h2>
        <p className="text-sm text-ink-500">
          Необратимо удаляет все данные приложения из этого браузера. Сделайте экспорт заранее, если хотите сохранить
          историю.
        </p>
        <button
          onClick={handleClear}
          className="bg-white border border-clay-500 text-clay-600 hover:bg-clay-100 text-sm font-medium rounded-full px-5 py-2"
        >
          Очистить данные
        </button>
      </div>
    </div>
  )
}
