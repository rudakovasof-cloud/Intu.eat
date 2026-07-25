interface ScaleSliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  lowLabel: string
  highLabel: string
  accent?: 'sage' | 'clay'
  wordLabels?: Record<number, string>
}

export function ScaleSlider({ label, value, onChange, lowLabel, highLabel, accent = 'sage', wordLabels }: ScaleSliderProps) {
  const trackColor = accent === 'sage' ? 'accent-sage-500' : 'accent-clay-500'
  const badgeColor = accent === 'sage' ? 'bg-sage-100 text-sage-700' : 'bg-clay-100 text-clay-600'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-ink-700">{label}</label>
        <span className={`text-sm font-semibold rounded-full px-2 py-0.5 ${badgeColor}`}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${trackColor} cursor-pointer`}
      />
      <div className="flex justify-between text-xs text-ink-500/70 mt-0.5">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
      {wordLabels?.[value] && <p className={`text-xs font-medium mt-1.5 ${accent === 'sage' ? 'text-sage-600' : 'text-clay-600'}`}>{wordLabels[value]}</p>}
    </div>
  )
}
