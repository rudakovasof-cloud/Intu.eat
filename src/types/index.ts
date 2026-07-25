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

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Завтрак',
  lunch: 'Обед',
  dinner: 'Ужин',
  snack: 'Перекус',
}

// Симптомы функциональной диспепсии, 0–4 (шкала тяжести): нет / лёгкая / умеренная / выраженная / сильная
export interface DyspepsiaSymptoms {
  nausea: number
  fullness: number // чувство переполненного, тяжёлого желудка (отдельно от шкалы сытости IE)
}

// Одна запись в дневнике питания.
// Намеренно нет полей "калории" / "вес порции" / "вес тела" — это дневник
// наблюдения за телесными сигналами и мыслями, а не подсчёта.
export interface DiaryEntry {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM, начало приёма пищи
  endTime?: string // HH:MM, окончание приёма пищи
  mealType: MealType
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
  dyspepsia?: DyspepsiaSymptoms // заполняется только если пользователь открыл этот раздел
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

export type AssessmentStage = 'intake' | 'midpoint' | 'final'

export interface AssessmentResult {
  id: string
  stage: AssessmentStage
  completedAt: string
  scoffAnswers?: Record<string, boolean> // questionId -> да/нет
  scoffScore?: number // 0–5, кол-во "да"
  likertAnswers?: Record<string, number> // itemId -> 1–5
  likertScore?: number // сумма
  likertMax?: number
}
