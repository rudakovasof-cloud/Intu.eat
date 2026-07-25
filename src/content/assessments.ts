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

// Шкала типа пищевого поведения: два независимых блока (ограничение /
// переедание), по 8 утверждений каждый. Авторская формулировка вопросов,
// но опирается на ту же исследовательскую традицию, что и терапевтическая
// практика в русскоязычном интуитивном питании — трёхфакторную модель
// пищевого поведения (ограничительное / эмоциогенное / экстернальное),
// восходящую к голландскому опроснику пищевого поведения DEBQ
// (Van Strien et al., 1986). Это не воспроизведение чьего-либо
// проприетарного теста, а отдельный инструмент для этой тетради.
export const RESTRICTION_ITEMS: LikertItem[] = [
  { id: 'r-less-than-want', text: 'Я намеренно ем меньше, чем на самом деле хочется, чтобы контролировать вес' },
  { id: 'r-forbidden-list', text: 'У меня есть чёткий список продуктов, которые я себе не разрешаю' },
  { id: 'r-skip-meals', text: 'Я часто пропускаю приёмы пищи, чтобы «сэкономить» на потом' },
  { id: 'r-control-anxiety', text: 'Я тревожусь, если не могу полностью контролировать, что и сколько ем' },
  { id: 'r-rigid-rules', text: 'У меня есть жёсткие правила по времени и количеству еды' },
  { id: 'r-guilt-overplan', text: 'Я чувствую вину, если съедаю больше, чем «планировала(л)»' },
  { id: 'r-delay-eating', text: 'Я оттягиваю момент, когда разрешаю себе поесть, даже почувствовав голод' },
  { id: 'r-compensate', text: 'После «лишней» еды я компенсирую это голоданием или урезанием следующих порций' },
]

export const OVEREATING_ITEMS: LikertItem[] = [
  { id: 'o-fast-no-hunger', text: 'Я ем быстро и много, даже не чувствуя явного голода' },
  { id: 'o-loss-of-control', text: 'Бывают эпизоды, когда я не могу остановиться, пока не почувствую физическую боль от переполнения' },
  { id: 'o-secret-eating', text: 'Я ем в одиночку или тайно, чтобы никто не видел, сколько я съедаю' },
  { id: 'o-shame-after', text: 'После переедания я чувствую стыд и хочу «исправить» это ограничением' },
  { id: 'o-food-for-emotions', text: 'Я использую еду, чтобы заглушить тяжёлые эмоции' },
  { id: 'o-cant-stop-full', text: 'Мне сложно остановиться, даже когда я замечаю, что уже сыта(сыт)' },
  { id: 'o-stockpile', text: 'Я запасаюсь едой «на случай», когда почувствую, что могу переесть' },
  { id: 'o-frequency', text: 'Эпизоды переедания происходят у меня регулярно — несколько раз в неделю или чаще' },
]

export type EatingPattern = 'restriction' | 'overeating' | 'mixed' | 'none'

export interface AssessmentDef {
  stage: AssessmentStage
  title: string
  timingLabel: string
  description: string
  includeScoff: boolean
  includeLikert: boolean
  includeEatingPattern: boolean
}

export const ASSESSMENTS: AssessmentDef[] = [
  {
    stage: 'intake',
    title: 'Входная диагностика',
    timingLabel: 'До начала курса',
    description:
      'Скрининг SCOFF, шкала самонаблюдения за отношениями с едой и определение преобладающего паттерна — ограничение или переедание. Задача — зафиксировать точку отсчёта, а не поставить диагноз.',
    includeScoff: true,
    includeLikert: true,
    includeEatingPattern: true,
  },
  {
    stage: 'midpoint',
    title: 'Промежуточный тест',
    timingLabel: 'После недели 5',
    description: 'Та же шкала самонаблюдения — чтобы увидеть, что уже сдвинулось, а что пока даётся сложнее.',
    includeScoff: false,
    includeLikert: true,
    includeEatingPattern: false,
  },
  {
    stage: 'final',
    title: 'Итоговый тест',
    timingLabel: 'После недели 10',
    description: 'Повторный SCOFF и шкала самонаблюдения — сравнение с входной диагностикой и промежуточным тестом.',
    includeScoff: true,
    includeLikert: true,
    includeEatingPattern: false,
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

export const computeRestrictionScore = (answers: Record<string, number>) =>
  RESTRICTION_ITEMS.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0)

export const computeOvereatingScore = (answers: Record<string, number>) =>
  OVEREATING_ITEMS.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0)

export const EATING_PATTERN_SUBSCALE_MAX = RESTRICTION_ITEMS.length * 5 // 40

const ELEVATED_THRESHOLD = RESTRICTION_ITEMS.length * 3 // 24, выше середины шкалы
const DOMINANCE_GAP = 6 // на сколько баллов одна шкала должна превышать другую

export const classifyEatingPattern = (restrictionScore: number, overeatingScore: number): EatingPattern => {
  const diff = restrictionScore - overeatingScore
  if (restrictionScore < ELEVATED_THRESHOLD && overeatingScore < ELEVATED_THRESHOLD) return 'none'
  if (diff >= DOMINANCE_GAP) return 'restriction'
  if (diff <= -DOMINANCE_GAP) return 'overeating'
  return 'mixed'
}

export const EATING_PATTERN_LABELS: Record<EatingPattern, string> = {
  restriction: 'Преобладает ограничительный паттерн',
  overeating: 'Преобладает паттерн переедания',
  mixed: 'Смешанный, циклический паттерн',
  none: 'Выраженного паттерна не выявлено',
}

export const interpretEatingPattern = (pattern: EatingPattern): string => {
  switch (pattern) {
    case 'restriction':
      return 'Сейчас преобладает ограничительное пищевое поведение: строгие правила, попытки контролировать голод, чувство вины за «лишнее». Часто именно длительное ограничение со временем провоцирует эпизоды потери контроля — стоит начать с недель 1–3 курса (диетическое мышление, голод, мир с едой).'
    case 'overeating':
      return 'Сейчас преобладают эпизоды переедания и потери контроля над количеством еды. Это часто связано не с «отсутствием силы воли», а с эмоциональной регуляцией и/или предшествующими ограничениями. Обратите особое внимание на недели 5–7 курса (сытость, удовлетворение, эмоции без еды).'
    case 'mixed':
      return 'Обе шкалы повышены — это типичная картина цикла «ограничение → переедание → чувство вины → новое ограничение». Работа с этим циклом обычно требует внимания и к правилам/ограничениям (недели 1, 3, 4), и к сигналам сытости и эмоциям (недели 5, 7).'
    case 'none':
      return 'Заметно выраженных паттернов ограничения или переедания по этой шкале не выявлено. Это не исключает других трудностей с едой — доверяйте собственным ощущениям и дневнику питания больше, чем баллу.'
  }
}
