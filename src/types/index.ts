// Причина, по которой человек начал есть — без осуждения, просто для наблюдения за паттерном
export type EatingReason =
  | 'physical_hunger' // физический голод
  | 'emotional' // эмоциональный голод
  | 'external_cue' // внешний повод (время, запах, реклама, "за компанию")
  | 'habit' // привычка / автоматизм
  | 'social' // социальная ситуация
  | 'other'

export const EATING_REASON_LABELS: Record<EatingReason, string> = {
  physical_hunger: 'Физический голод',
  emotional: 'Эмоциональный голод',
  external_cue: 'Внешний повод',
  habit: 'Привычка / автоматизм',
  social: 'Социальная ситуация',
  other: 'Другое',
}

export const EMOTION_TAGS = [
  'спокойствие',
  'радость',
  'тревога',
  'грусть',
  'злость',
  'скука',
  'усталость',
  'вина',
  'стыд',
  'одиночество',
  'стресс',
  'облегчение',
  'нейтрально',
] as const

export type EmotionTag = (typeof EMOTION_TAGS)[number]

// Одна запись в дневнике питания.
// Намеренно нет полей "калории" / "вес порции" / "вес тела" — это дневник
// наблюдения за телесными сигналами и мыслями, а не подсчёта.
export interface DiaryEntry {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  hungerBefore: number // 0 (не голоден вовсе) — 10 (нестерпимый голод)
  fullnessAfter: number // 0 (пусто) — 10 (переполнен до дискомфорта)
  food: string // свободное описание еды
  context: string // где / с кем / что происходило
  emotionsBefore: string[]
  emotionsAfter: string[]
  eatingReason: EatingReason
  dietRuleThought: boolean // была ли мысль вроде "нельзя", "надо было сдержаться", "это плохая еда"
  satisfaction: number // 1 (совсем не понравилось) — 5 (очень вкусно и приятно)
  thoughts: string // мысли до/во время/после еды
  createdAt: string // ISO timestamp
}

export interface ExerciseAnswer {
  exerciseId: string
  answer: string
  checkedItems?: string[]
  completedAt: string
}

export interface WeekProgress {
  weekNumber: number
  answers: Record<string, ExerciseAnswer>
  startedAt?: string
  completedAt?: string
}

export interface SavedWeeklyReport {
  id: string
  weekNumber: number | null
  rangeStart: string
  rangeEnd: string
  generatedAt: string
  entryCount: number
  reportText: string
}
