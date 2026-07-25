import { SEVERITY_LABELS } from '../content/scales'

interface SeverityScaleProps {
  label: string
  value: number
  onChange: (v: number) => void
}

export function SeverityScale({ label, value, onChange }: SeverityScaleProps) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-700 block mb-1.5">{label}</label>
      <div className="flex gap-1.5 flex-wrap">
        {SEVERITY_LABELS.map((text, level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
              value === level ? 'bg-clay-500 border-clay-500 text-white' : 'bg-white border-cream-200 text-ink-500 hover:border-clay-300'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
