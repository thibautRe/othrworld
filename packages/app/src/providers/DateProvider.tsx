import React from 'react'
import { useFrame } from '../hooks/useFrame'
import { useKeyListener } from '../hooks/useKeyListener'

interface DateContext {
  currentDate: Date
  /** Useful for some callbacks that don't want to depend on a mutating date */
  currentDateRef: { readonly current: Date }
  /** Represents the time multiplication */
  currentTimeMult: number

  registerDateAction: (t: Date, action: () => void) => void

  resetCurrentDate: () => void
}
const DateContext = React.createContext<DateContext>({
  currentDate: new Date(),
  currentDateRef: { current: new Date() },
  currentTimeMult: 1,
  registerDateAction: () => {},
  resetCurrentDate: () => {},
})
const PlayPauseContext = React.createContext(true)

export const DateProvider: React.FC = ({ children }) => {
  const [currentDate, setCurrentDate] = React.useState(() => new Date())
  const currentDateRef = React.useRef(currentDate)
  const [currentTimeMult, setCurrentTimeMult] = React.useState(1000)
  const [isPlay, setIsPlay] = React.useState(true)

  const dateActionsRef = React.useRef(new Map<Date, () => void>())

  useKeyListener(
    ' ',
    React.useCallback(() => setIsPlay((p) => !p), [])
  )
  useKeyListener(
    '+',
    React.useCallback(() => setCurrentTimeMult((tm) => tm * 2), [])
  )
  useKeyListener(
    '-',
    React.useCallback(() => setCurrentTimeMult((tm) => tm / 2), [])
  )

  const frameRun = React.useCallback(() => {
    setCurrentDate((cd) => {
      const nd = new Date()
      const newTimeTentative = cd.getTime() + currentTimeMult

      const runnableActions = Array.from(dateActionsRef.current.keys())
        .filter((d) => d.getTime() <= newTimeTentative)
        .sort((a, b) => a.getTime() - b.getTime())
      if (runnableActions.length) {
        nd.setTime(runnableActions[0].getTime())
        const action = dateActionsRef.current.get(runnableActions[0])!
        action()
        dateActionsRef.current.delete(runnableActions[0])
      } else {
        nd.setTime(newTimeTentative)
      }

      // Update the ref
      currentDateRef.current = nd
      return nd
    })
  }, [currentTimeMult])

  useFrame(isPlay ? frameRun : null)

  const registerDateAction = React.useCallback(
    (t: Date, action: () => void) => {
      if (t.getTime() < currentDateRef.current.getTime()) {
        throw new Error('Cannot register an action for a date in the past')
      }
      // If there was already an action registered, run both of these action
      if (dateActionsRef.current.has(t)) {
        const prevAction = dateActionsRef.current.get(t)!
        dateActionsRef.current.set(t, () => {
          prevAction()
          action()
        })
      }
      dateActionsRef.current.set(t, action)
    },
    []
  )

  const resetCurrentDate = React.useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  return (
    <DateContext.Provider
      value={{
        currentDate,
        currentDateRef,
        currentTimeMult,
        registerDateAction,
        resetCurrentDate,
      }}
    >
      <PlayPauseContext.Provider value={isPlay}>
        {children}
      </PlayPauseContext.Provider>
    </DateContext.Provider>
  )
}

export const useDateContext = () => React.useContext(DateContext)
export const useCurrentDate = () => useDateContext().currentDate
export const useCurrentTimeMult = () => useDateContext().currentTimeMult

export const usePlayPause = () => React.useContext(PlayPauseContext)
