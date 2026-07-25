import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssessmentResult, DiaryEntry, ExerciseAnswer, SavedWeeklyReport, WeekProgress } from '../types'

interface AppState {
  entries: DiaryEntry[]
  weekProgress: Record<number, WeekProgress>
  reports: SavedWeeklyReport[]
  practiceAnswers: Record<string, ExerciseAnswer>
  assessmentResults: AssessmentResult[]

  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void
  updateEntry: (id: string, patch: Partial<DiaryEntry>) => void
  deleteEntry: (id: string) => void

  saveAnswer: (weekNumber: number, answer: ExerciseAnswer) => void
  markWeekComplete: (weekNumber: number) => void

  saveReport: (report: Omit<SavedWeeklyReport, 'id'>) => void
  deleteReport: (id: string) => void

  savePracticeAnswer: (answer: ExerciseAnswer) => void

  saveAssessmentResult: (result: Omit<AssessmentResult, 'id'>) => void
  deleteAssessmentResult: (id: string) => void
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      entries: [],
      weekProgress: {},
      reports: [],
      practiceAnswers: {},
      assessmentResults: [],

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

      savePracticeAnswer: (answer) =>
        set((state) => ({
          practiceAnswers: { ...state.practiceAnswers, [answer.exerciseId]: answer },
        })),

      saveAssessmentResult: (result) =>
        set((state) => ({ assessmentResults: [{ ...result, id: uid() }, ...state.assessmentResults] })),

      deleteAssessmentResult: (id) =>
        set((state) => ({ assessmentResults: state.assessmentResults.filter((r) => r.id !== id) })),
    }),
    { name: 'intueat-storage' },
  ),
)
