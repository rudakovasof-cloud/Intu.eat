import { useState } from 'react'
import { format } from 'date-fns'
import { ScaleSlider } from './ScaleSlider'
import { EmotionPicker } from './EmotionPicker'
import { EATING_REASON_LABELS, type DiaryEntry, type EatingReason } from '../types'
import { useAppStore } from '../store/useAppStore'

const REASONS = Object.entries(EATING_REASON_LABELS) as [EatingReason, string][]

interface Props {
  onDone?: () => void
  initial?: DiaryEntry
}

const emptyState = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  time: format(new Date(), 'HH:mm'),
  hungerBefore: 5,
  fullnessAfter: 5,
  food: '',
  context: '',
  emotionsBefore: [] as string[],
  emotionsAfter: [] as string[],
  eatingReason: 'physical_hunger' as EatingReason,
  dietRuleThought: false,
  satisfaction: 3,
  thoughts: '',
})

export function DiaryEntryForm({ onDone, initial }: Props) {
  const addEntry = useAppStore((s) => s.addEntry)
  const updateEntry = useAppStore((s) => s.updateEntry)
  const [form, setForm] = useState(() => (initial ? { ...initial } : emptyState()))

  const set = <K extends keyof ReturnType<typeof emptyState>>(key: K, value: ReturnType<typeof emptyState>[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.food.trim()) return
    if (initial) {
      updateEntry(initial.id, form)
    } else {
      addEntry(form)
    }
    setForm(emptyState())
    onDone?.()
  }

  return (
    <form onSubmit={submit} className="space-y-5 bg-white rounded-2xl border border-cream-200 p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-ink-700 block mb-1">Дата</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 block mb-1">Время</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => set('time', e.target.value)}
            className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink-700 block mb-1">Что ели / пили</label>
        <input
          type="text"
          required
          value={form.food}
          onChange={(e) => set('food', e.target.value)}
          placeholder="Опишите свободно, без подсчётов"
          className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink-700 block mb-1">Контекст (где, с кем, что происходило)</label>
        <input
          type="text"
          value={form.context}
          onChange={(e) => set('context', e.target.value)}
          className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
      </div>

      <ScaleSlider
        label="Голод перед едой"
        value={form.hungerBefore}
        onChange={(v) => set('hungerBefore', v)}
        lowLabel="0 — не голодна(ен)"
        highLabel="10 — нестерпимый голод"
        accent="clay"
      />
      <ScaleSlider
        label="Сытость после еды"
        value={form.fullnessAfter}
        onChange={(v) => set('fullnessAfter', v)}
        lowLabel="0 — пусто"
        highLabel="10 — переполнена(ен)"
        accent="sage"
      />

      <EmotionPicker label="Эмоции перед едой" selected={form.emotionsBefore} onChange={(v) => set('emotionsBefore', v)} />
      <EmotionPicker label="Эмоции после еды" selected={form.emotionsAfter} onChange={(v) => set('emotionsAfter', v)} />

      <div>
        <label className="text-sm font-medium text-ink-700 block mb-1">Что было основным поводом поесть</label>
        <div className="flex flex-wrap gap-1.5">
          {REASONS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => set('eatingReason', key)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                form.eatingReason === key
                  ? 'bg-clay-500 border-clay-500 text-white'
                  : 'bg-white border-cream-200 text-ink-500 hover:border-clay-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink-700 block mb-1">
          Удовлетворение от еды: <span className="font-semibold">{form.satisfaction}/5</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => set('satisfaction', n)}
              className={`h-9 w-9 rounded-lg border text-sm transition-colors ${
                n <= form.satisfaction ? 'bg-sage-400 border-sage-400 text-white' : 'bg-white border-cream-200 text-ink-500'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.dietRuleThought}
          onChange={(e) => set('dietRuleThought', e.target.checked)}
          className="h-4 w-4 accent-clay-500"
        />
        Была мысль вроде «нельзя» / «нарушила правило» / «это плохая еда»
      </label>

      <div>
        <label className="text-sm font-medium text-ink-700 block mb-1">Мысли до / во время / после еды</label>
        <textarea
          value={form.thoughts}
          onChange={(e) => set('thoughts', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium rounded-full px-5 py-2 transition-colors"
        >
          {initial ? 'Сохранить изменения' : 'Добавить запись'}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-ink-500 hover:text-ink-700 rounded-full px-4 py-2"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}
