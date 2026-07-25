import { eachDayOfInterval, endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { DiaryEntry, EatingReason } from '../types'
import { EATING_REASON_LABELS } from '../types'

export interface WeekRange {
  start: Date
  end: Date
}

export const getIsoWeekRange = (dateInWeek: Date): WeekRange => ({
  start: startOfWeek(dateInWeek, { weekStartsOn: 1 }),
  end: endOfWeek(dateInWeek, { weekStartsOn: 1 }),
})

export const entriesInRange = (entries: DiaryEntry[], range: WeekRange) =>
  entries.filter((e) => {
    const d = parseISO(e.date)
    return isWithinInterval(d, { start: range.start, end: range.end })
  })

const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0)

const topCounts = (tags: string[], n = 3) => {
  const counts = new Map<string, number>()
  for (const t of tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)
}

const pct = (part: number, total: number) => (total === 0 ? 0 : Math.round((part / total) * 100))

export interface WeeklyStats {
  count: number
  daysLogged: number
  avgHunger: number
  avgFullness: number
  avgSatisfaction: number
  veryHungryPct: number // hungerBefore <= 1
  overfullPct: number // fullnessAfter >= 9
  comfortableRangePct: number // hunger 2-5 & fullness 4-7
  dietThoughtPct: number
  reasonCounts: Record<EatingReason, number>
  emotionsBeforeTop: [string, number][]
  emotionsAfterTop: [string, number][]
  lowSatisfactionPct: number // satisfaction <= 2
  dyspepsiaTrackedCount: number
  avgNausea: number
  avgStomachFullness: number
  dyspepsiaModerateOrWorsePct: number // среди записей, где симптомы отслеживались
}

export const computeWeeklyStats = (entries: DiaryEntry[]): WeeklyStats => {
  const count = entries.length
  const days = new Set(entries.map((e) => e.date))
  const reasonCounts: Record<EatingReason, number> = {
    physical_hunger: 0,
    emotional: 0,
    external_cue: 0,
    habit: 0,
    social: 0,
    other: 0,
  }
  for (const e of entries) reasonCounts[e.eatingReason]++

  const dyspepsiaEntries = entries.filter((e) => e.dyspepsia)

  return {
    count,
    daysLogged: days.size,
    avgHunger: avg(entries.map((e) => e.hungerBefore)),
    avgFullness: avg(entries.map((e) => e.fullnessAfter)),
    avgSatisfaction: avg(entries.map((e) => e.satisfaction)),
    veryHungryPct: pct(entries.filter((e) => e.hungerBefore <= 1).length, count),
    overfullPct: pct(entries.filter((e) => e.fullnessAfter >= 9).length, count),
    comfortableRangePct: pct(
      entries.filter((e) => e.hungerBefore >= 2 && e.hungerBefore <= 5 && e.fullnessAfter >= 4 && e.fullnessAfter <= 7).length,
      count,
    ),
    dietThoughtPct: pct(entries.filter((e) => e.dietRuleThought).length, count),
    reasonCounts,
    emotionsBeforeTop: topCounts(entries.flatMap((e) => e.emotionsBefore)),
    emotionsAfterTop: topCounts(entries.flatMap((e) => e.emotionsAfter)),
    lowSatisfactionPct: pct(entries.filter((e) => e.satisfaction <= 2).length, count),
    dyspepsiaTrackedCount: dyspepsiaEntries.length,
    avgNausea: avg(dyspepsiaEntries.map((e) => e.dyspepsia!.nausea)),
    avgStomachFullness: avg(dyspepsiaEntries.map((e) => e.dyspepsia!.fullness)),
    dyspepsiaModerateOrWorsePct: pct(
      dyspepsiaEntries.filter((e) => e.dyspepsia!.nausea >= 2 || e.dyspepsia!.fullness >= 2).length,
      dyspepsiaEntries.length,
    ),
  }
}

export const generateWeeklyReportText = (
  entries: DiaryEntry[],
  range: WeekRange,
  opts?: { weekNumber?: number | null; weekFocusLabel?: string },
): string => {
  const rangeLabel = `${format(range.start, 'd MMMM', { locale: ru })} — ${format(range.end, 'd MMMM', { locale: ru })}`

  if (entries.length === 0) {
    return `Отчёт за неделю ${rangeLabel}\n\nЗа эту неделю в дневнике нет записей, поэтому проанализировать паттерны питания пока невозможно. Это не повод для самокритики — возможно, неделя была насыщенной или дневник ещё не вошёл в привычку. Попробуйте фиксировать хотя бы 2–3 приёма пищи в день, чтобы на следующей неделе отчёт был содержательным.`
  }

  const s = computeWeeklyStats(entries)
  const totalDays = eachDayOfInterval({ start: range.start, end: range.end }).length
  const lines: string[] = []

  lines.push(`Отчёт за неделю: ${rangeLabel}`)
  if (opts?.weekNumber) {
    lines.push(`Неделя курса №${opts.weekNumber}${opts.weekFocusLabel ? ` — фокус: «${opts.weekFocusLabel}»` : ''}`)
  }
  lines.push('')

  // Обзор
  lines.push('1. Обзор недели')
  lines.push(
    `Записей в дневнике: ${s.count}, дней с хотя бы одной записью: ${s.daysLogged} из ${totalDays}.`,
  )
  if (s.daysLogged <= 2) {
    lines.push('Записей пока немного — выводы ниже стоит воспринимать как предварительные.')
  }
  lines.push('')

  // Голод и сытость
  lines.push('2. Голод и сытость')
  lines.push(
    `Средний уровень голода перед едой: ${s.avgHunger.toFixed(1)} из 10. Средний уровень сытости после еды: ${s.avgFullness.toFixed(1)} из 10.`,
  )
  lines.push(`Приёмов пищи в комфортном диапазоне (умеренный голод перед едой и комфортная сытость после): ${s.comfortableRangePct}%.`)
  if (s.veryHungryPct >= 25) {
    lines.push(
      `В ${s.veryHungryPct}% случаев еда начиналась при очень сильном голоде (0–1 по шкале). Это может говорить о слишком долгих промежутках между едой и повышает риск потери контроля во время еды — стоит присмотреться, не пропускаются ли приёмы пищи.`,
    )
  }
  if (s.overfullPct >= 25) {
    lines.push(
      `В ${s.overfullPct}% случаев после еды фиксировалась сильная переполненность (9–10 по шкале). Стоит понаблюдать, что происходит незадолго до этого момента — скорость еды, отвлечения, эмоциональное состояние.`,
    )
  }
  if (s.veryHungryPct >= 25 && s.overfullPct >= 25) {
    lines.push(
      'Сочетание сильного голода перед едой и переполненности после — типичный паттерн цикла "ограничение → переедание". Это наблюдение, а не диагноз, но именно с ним хорошо работать с недель 2 и 5 курса (голод и сытость).',
    )
  }
  lines.push('')

  // Причины и эмоции
  lines.push('3. Что стояло за желанием поесть')
  const reasonEntries = Object.entries(s.reasonCounts) as [EatingReason, number][]
  const reasonStr = reasonEntries
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, c]) => `${EATING_REASON_LABELS[reason]} — ${pct(c, s.count)}%`)
    .join(', ')
  lines.push(reasonStr || 'Недостаточно данных.')
  const emotionalPct = pct(s.reasonCounts.emotional, s.count)
  if (emotionalPct >= 30) {
    const emotionsClause = s.emotionsBeforeTop.length
      ? ` Чаще всего перед едой присутствовали эмоции: ${s.emotionsBeforeTop.map(([e, c]) => `${e} (${c})`).join(', ')}.`
      : ''
    lines.push(
      `Эмоциональный голод отмечен в ${emotionalPct}% записей.${emotionsClause} Это не проблема сама по себе, но полезно расширять список способов заботы о себе, не связанных с едой — см. неделю 7 курса.`,
    )
  }
  lines.push('')

  // Диетическое мышление
  lines.push('4. Диетическое мышление')
  lines.push(`Мысли в духе "нельзя" / "нарушила правило" сопровождали ${s.dietThoughtPct}% приёмов пищи.`)
  if (s.dietThoughtPct >= 40) {
    lines.push(
      'Это довольно высокая доля — возможно, стоит вернуться к упражнениям недели 1 (диетическое мышление) и недели 4 (внутренний критик), чтобы продолжить ослаблять эти автоматические оценки.',
    )
  } else if (s.dietThoughtPct <= 10 && s.count >= 5) {
    lines.push('Это низкая доля — хороший признак того, что диетические установки понемногу теряют силу.')
  }
  lines.push('')

  // Удовлетворение
  lines.push('5. Удовлетворение от еды')
  lines.push(`Средний уровень удовлетворения: ${s.avgSatisfaction.toFixed(1)} из 5.`)
  if (s.lowSatisfactionPct >= 30) {
    lines.push(
      `В ${s.lowSatisfactionPct}% случаев удовлетворение было низким (1–2 из 5). Низкое удовольствие от еды может приводить к желанию "доесть" что-то ещё даже при физической сытости — см. неделю 6 курса (фактор удовлетворения).`,
    )
  }
  lines.push('')

  // Симптомы пищеварения
  if (s.dyspepsiaTrackedCount > 0) {
    lines.push('6. Симптомы пищеварения')
    lines.push(
      `Симптомы отслеживались в ${s.dyspepsiaTrackedCount} из ${s.count} записей. Средняя тошнота: ${s.avgNausea.toFixed(1)} из 4, среднее чувство тяжести/переполненности желудка: ${s.avgStomachFullness.toFixed(1)} из 4.`,
    )
    if (s.dyspepsiaModerateOrWorsePct >= 40) {
      lines.push(
        `В ${s.dyspepsiaModerateOrWorsePct}% отслеженных случаев симптомы были умеренными или сильнее. Это может быть признаком функциональной диспепсии — состояния, которое нередко сопровождает восстановление питания после ограничений. Если симптомы повторяются регулярно, стоит обсудить их с гастроэнтерологом или диетологом, работающим с РПП: они не всегда означают, что порция была "слишком большой", и не повод возвращаться к ограничениям.`,
      )
    }
    lines.push('')
  }

  // Рекомендации
  lines.push(`${s.dyspepsiaTrackedCount > 0 ? '7' : '6'}. Рекомендации на следующую неделю`)
  const recs: string[] = []
  if (s.daysLogged < 4) recs.push('Попробуйте вести дневник чаще — хотя бы 2–3 записи в день дадут более точную картину.')
  if (s.veryHungryPct >= 25) recs.push('Обратите внимание на промежутки между приёмами пищи — не пропускаются ли они.')
  if (s.overfullPct >= 25) recs.push('Попробуйте практику паузы в середине еды (упражнение недели 5).')
  if (emotionalPct >= 30) recs.push('Составьте или дополните список опор, не связанных с едой (упражнение недели 7).')
  if (s.dietThoughtPct >= 40) recs.push('Вернитесь к упражнению "Ответ критику" (неделя 4).')
  if (s.lowSatisfactionPct >= 30) recs.push('Попробуйте осознанно выбрать то, что действительно нравится по вкусу (неделя 6).')
  if (s.dyspepsiaModerateOrWorsePct >= 40) recs.push('Обсудите повторяющиеся симптомы пищеварения со специалистом — гастроэнтерологом или диетологом недиетического подхода.')
  if (recs.length === 0) recs.push('Заметных тревожных паттернов не обнаружено — продолжайте в том же темпе и доверяйте своим наблюдениям.')
  lines.push(...recs.map((r) => `• ${r}`))
  lines.push('')

  lines.push(
    'Это автоматический анализ на основе ваших собственных записей, а не медицинское заключение. Если паттерны питания вызывают тревогу или мешают повседневной жизни, хорошая идея — обсудить их со специалистом по РПП (психотерапевтом или диетологом недиетического подхода).',
  )

  return lines.join('\n')
}
