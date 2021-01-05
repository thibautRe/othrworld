import create from 'zustand'

type DateAction = () => void
type DateState = {
  currentDate: Date
  resetCurrentDate: () => void

  isPaused: boolean
  setIsPaused: (isPaused: boolean) => void
  toggleIsPaused: () => void

  timeMult: number
  setTimeMult: (timeMult: number) => void

  dateActions: Map<number, DateAction>
  registerDateAction: (t: Date, action: () => void) => void

  runFrame: () => void
}

export const useDateStore = create<DateState>((set, get) => ({
  currentDate: new Date(),
  resetCurrentDate: () => set({ currentDate: new Date() }),

  isPaused: false,
  setIsPaused: (isPaused) => set({ isPaused }),
  toggleIsPaused: () => set((s) => ({ isPaused: !s.isPaused })),

  /** @unit ms/frame */
  timeMult: 1000,
  setTimeMult: (timeMult) => set({ timeMult }),

  dateActions: new Map(),
  registerDateAction: (t, action) => {
    const time = t.getTime()
    const { currentDate, dateActions } = get()
    if (time <= currentDate.getTime()) {
      throw new Error('Cannot register an action for a date in the past')
    }
    // If there was already an action registered, run both of these action
    if (dateActions.has(time)) {
      const prevAction = dateActions.get(time)!
      dateActions.set(time, () => {
        prevAction()
        action()
      })
      return
    }
    dateActions.set(time, action)
  },

  runFrame: () => {
    const { currentDate, timeMult, dateActions } = get()
    let newTimeTarget = currentDate.getTime() + timeMult

    const runnableActionsTimestamps = Array.from(dateActions.keys())
      .filter((d) => d <= newTimeTarget)
      .sort((a, b) => a - b)

    if (runnableActionsTimestamps.length) {
      const timestamp = runnableActionsTimestamps[0]
      set({ currentDate: new Date(timestamp) })
      const action = dateActions.get(timestamp)!
      dateActions.delete(timestamp)
      action()
    } else {
      set({ currentDate: new Date(newTimeTarget) })
    }
  },
}))

const currentDateGetter = (s: DateState) => s.currentDate
export const useCurrentDate = () => useDateStore(currentDateGetter)

const isPausedGetter = (s: DateState) => s.isPaused
export const useIsPaused = () => useDateStore(isPausedGetter)
