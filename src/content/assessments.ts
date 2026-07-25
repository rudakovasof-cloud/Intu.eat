import type { AssessmentStage } from '../types'

export interface ScoffQuestion {
  id: string
  text: string
}

// Опросник SCOFF — короткий (5 вопросов) скрининговый инструмент,
// разработанный для первичного выявления возможного расстройства пищевого
// поведения (Morgan, Reid, Lacey, 1999). Это не диагностика, а повод
// присмотреться и при необходимости обратиться к специалисту.
export const SCOFF_QUESTIONS: ScoffQuestion[] = [
  { id: 'sick', text: 'Вызываете ли вы у себя рвоту, потому что чувствуете дискомфорт от переполненного желудка?' },
  { id: 'control', text: 'Беспокоитесь ли вы, что потеряли контроль над тем, сколько едите?' },
  { id: 'onestone', text: 'Теряли ли вы за последние 3 месяца больше 6 кг веса?' },
  { id: 'fat', text: 'Считаете ли вы себя полной(ым), даже если окружающие говорят, что вы худая(ой)?' },
  { id: 'food', text: 'Могли бы вы сказать, что еда и мысли о ней занимают доминирующее место в вашей жизни?' },
]

export interface LikertItem {
  id: string
  text: string
}

// Авторская шкала для самонаблюдения за отношениями с едой в рамках этой
// тетради (не является валидированным клиническим инструментом). Чем выше
// согласие, тем ближе поведение к интуитивному питанию.
export const LIKERT_ITEMS: LikertItem[] = [
  { id: 'permission', text: 'Я разрешаю себе есть любую еду без чувства вины' },
  { id: 'hunger-emotion', text: 'Я умею отличать физический голод от эмоционального' },
  { id: 'stop-fullness', text: 'Я останавливаюсь, когда чувствую комфортную сытость' },
  { id: 'no-good-bad', text: 'Я не делю продукты на «хорошие» и «плохие»' },
  { id: 'internal-cues', text: 'Я ем, ориентируясь на собственные сигналы, а не на внешние правила или расписание' },
  { id: 'leave-food', text: 'Я могу оставить еду недоеденной, если уже наелась(лся)' },
  { id: 'body-respect', text: 'Я отношусь к своему телу с уважением, независимо от его формы' },
  { id: 'not-only-food', text: 'Я не использую еду как единственный способ справиться с эмоциями' },
  { id: 'no-compensation', text: 'Я не занимаюсь спортом, чтобы «отработать» съеденное' },
  { id: 'trust-body', text: 'Я доверяю своему телу в выборе того, что ему нужно' },
  { id: 'no-guilt', text: 'Я редко испытываю чувство вины после еды' },
  { id: 'food-not-dominant', text: 'Мысли о еде не занимают большую часть моего дня' },
]

export const LIKERT_SCALE_LABELS = ['Совсем не про меня', 'Скорее не про меня', 'Отчасти', 'Скорее про меня', 'Полностью про меня']

export interface AssessmentDef {
  stage: AssessmentStage
  title: string
  timingLabel: string
  description: string
  includeScoff: boolean
  includeLikert: boolean
}

export const ASSESSMENTS: AssessmentDef[] = [
  {
    stage: 'intake',
    title: 'Входная диагностика',
    timingLabel: 'До начала курса',
    description:
      'Короткий скрининг SCOFF и шкала самонаблюдения за отношениями с едой. Задача — зафиксировать точку отсчёта, а не поставить диагноз.',
    includeScoff: true,
    includeLikert: true,
  },
  {
    stage: 'midpoint',
    title: 'Промежуточный тест',
    timingLabel: 'После недели 5',
    description: 'Та же шкала самонаблюдения — чтобы увидеть, что уже сдвинулось, а что пока даётся сложнее.',
    includeScoff: false,
    includeLikert: true,
  },
  {
    stage: 'final',
    title: 'Итоговый тест',
    timingLabel: 'После недели 10',
    description: 'Повторный SCOFF и шкала самонаблюдения — сравнение с входной диагностикой и промежуточным тестом.',
    includeScoff: true,
    includeLikert: true,
  },
]

export const getAssessmentDef = (stage: AssessmentStage) => ASSESSMENTS.find((a) => a.stage === stage)!

export const computeScoffScore = (answers: Record<string, boolean>) =>
  SCOFF_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ? 1 : 0), 0)

export const computeLikertScore = (answers: Record<string, number>) =>
  LIKERT_ITEMS.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0)

export const LIKERT_MAX = LIKERT_ITEMS.length * 5

export const interpretLikertScore = (score: number): string => {
  if (score <= LIKERT_ITEMS.length * 2) {
    return 'Сейчас в питании преобладают диетические установки и правила. Это нормальная отправная точка — курс как раз про постепенное движение от неё.'
  }
  if (score <= LIKERT_ITEMS.length * 3) {
    return 'Смешанная картина: часть интуитивных навыков уже формируется, но диетическое мышление всё ещё сильно влияет на выбор еды.'
  }
  if (score <= LIKERT_ITEMS.length * 4) {
    return 'Заметный прогресс в сторону интуитивного питания — многие принципы уже становятся частью повседневности.'
  }
  return 'Отношения с едой выглядят устойчиво интуитивными по большинству пунктов шкалы.'
}

export const interpretScoffScore = (score: number): string =>
  score >= 2
    ? 'Результат ≥2 — принято считать поводом присмотреться внимательнее и обсудить своё пищевое поведение со специалистом по РПП. Это скрининг, а не диагноз.'
    : 'Результат ниже порогового значения скрининга. Это не исключает трудностей с едой полностью — доверяйте собственным ощущениям больше, чем баллу.'
