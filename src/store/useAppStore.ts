import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DiaryEntry, ExerciseAnswer, SavedWeeklyReport, WeekProgress } from '../types'

interface AppState {
  entries: DiaryEntry[]
  weekProgress: Record<number, WeekProgress>
  reports: SavedWeeklyReport[]

  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void
  updateEntry: (id: string, patch: Partial<DiaryEntry>) => void
  deleteEntry: (id: string) => void

  saveAnswer: (weekNumber: number, answer: ExerciseAnswer) => void
  markWeekComplete: (weekNumber: number) => void

  saveReport: (report: Omit<SavedWeeklyReport, 'id'>) => void
  deleteReport: (id: string) => void
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      entries: [],
      weekProgress: {},
      reports: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [
            { ...entry, id: uid(), createdAt: new Date().toISOString() },
            ...state.entries,
          ].sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1)),
        })),

      updateEntry: (id, patch) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      saveAnswer: (weekNumber, answer) =>
        set((state) => {
          const existing = state.weekProgress[weekNumber] ?? { weekNumber, answers: {} }
          return {
            weekProgress: {
              ...state.weekProgress,
              [weekNumber]: {
                ...existing,
                startedAt: existing.startedAt ?? new Date().toISOString(),
                answers: { ...existing.answers, [answer.exerciseId]: answer },
              },
            },
          }
        }),

      markWeekComplete: (weekNumber) =>
        set((state) => {
          const existing = state.weekProgress[weekNumber] ?? { weekNumber, answers: {} }
          return {
            weekProgress: {
              ...state.weekProgress,
              [weekNumber]: { ...existing, completedAt: new Date().toISOString() },
            },
          }
        }),

      saveReport: (report) =>
        set((state) => ({ reports: [{ ...report, id: uid() }, ...state.reports] })),

      deleteReport: (id) =>
        set((state) => ({ reports: state.reports.filter((r) => r.id !== id) })),
    }),
    { name: 'intueat-storage' },
  ),
)
