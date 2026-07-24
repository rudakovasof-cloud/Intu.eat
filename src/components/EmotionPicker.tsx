import { EMOTION_TAGS } from '../types'

interface EmotionPickerProps {
  label: string
  selected: string[]
  onChange: (tags: string[]) => void
}

export function EmotionPicker({ label, selected, onChange }: EmotionPickerProps) {
  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag])
  }
  return (
    <div>
      <label className="text-sm font-medium text-ink-700 block mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {EMOTION_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              selected.includes(tag)
                ? 'bg-sage-500 border-sage-500 text-white'
                : 'bg-white border-cream-200 text-ink-500 hover:border-sage-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
