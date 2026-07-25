import { useAppStore } from '../store/useAppStore'

const BACKUP_VERSION = 1

export function exportBackup() {
  const { entries, weekProgress, reports, practiceAnswers, assessmentResults } = useAppStore.getState()
  const payload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: { entries, weekProgress, reports, practiceAnswers, assessmentResults },
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const dateStr = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `intueat-backup-${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export interface ImportResult {
  ok: boolean
  error?: string
  entryCount?: number
}

export function importBackup(json: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { ok: false, error: 'Файл повреждён или не является корректным JSON.' }
  }
  if (typeof parsed !== 'object' || parsed === null || !('data' in parsed)) {
    return { ok: false, error: 'Файл не похож на резервную копию Intu.eat.' }
  }
  const data = (parsed as { data: unknown }).data
  if (typeof data !== 'object' || data === null || !('entries' in data)) {
    return { ok: false, error: 'Файл не похож на резервную копию Intu.eat.' }
  }
  const d = data as {
    entries?: unknown
    weekProgress?: unknown
    reports?: unknown
    practiceAnswers?: unknown
    assessmentResults?: unknown
  }
  useAppStore.setState({
    entries: Array.isArray(d.entries) ? (d.entries as never) : [],
    weekProgress: (d.weekProgress as never) ?? {},
    reports: Array.isArray(d.reports) ? (d.reports as never) : [],
    practiceAnswers: (d.practiceAnswers as never) ?? {},
    assessmentResults: Array.isArray(d.assessmentResults) ? (d.assessmentResults as never) : [],
  })
  return { ok: true, entryCount: Array.isArray(d.entries) ? d.entries.length : 0 }
}

export function clearAllData() {
  useAppStore.setState({
    entries: [],
    weekProgress: {},
    reports: [],
    practiceAnswers: {},
    assessmentResults: [],
  })
}
