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

type Action = () => void
const bundledAction = (prevAction: Action, action: Action): Action => {
  console.log('registering bundled action')

  return () => {
    console.log('run bundled action')
    prevAction()
    action()
  }
}

export const DateProvider: React.FC = ({ children }) => {
  const [currentDate, setCurrentDate] = React.useState(() => new Date())
  const currentDateRef = React.useRef(currentDate)
  const [currentTimeMult, setCurrentTimeMult] = React.useState(1000)
  const [isPlay, setIsPlay] = React.useState(true)

  const dateActionsRef = React.useRef(new Map<number, () => void>())

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
    let newTimeTarget = currentDateRef.current.getTime() + currentTimeMult

    const runnableActionsTimestamps = Array.from(dateActionsRef.current.keys())
      .filter((d) => d <= newTimeTarget)
      .sort((a, b) => a - b)

    if (runnableActionsTimestamps.length) {
      const timestamp = runnableActionsTimestamps[0]
      console.log('Run action', timestamp)
      currentDateRef.current = new Date(timestamp)
      const action = dateActionsRef.current.get(timestamp)!
      action()
      dateActionsRef.current.delete(timestamp)
    } else {
      currentDateRef.current = new Date(newTimeTarget)
    }

    setCurrentDate(currentDateRef.current)
  }, [currentTimeMult])

  useFrame(isPlay ? frameRun : null)

  const registerDateAction = React.useCallback(
    (t: Date, action: () => void) => {
      const time = t.getTime()
      console.log('[DateProvider] Register action called', time, dateActionsRef)

      if (time <= currentDateRef.current.getTime()) {
        console.error(
          '[DateProvider] Cannot register an action for a date in the past'
        )
        return
      }
      // If there was already an action registered, run both of these action
      if (dateActionsRef.current.has(time)) {
        console.warn(
          '[DateProvider] Registering a second action for the same date',
          time
        )
        debugger
        const prevAction = dateActionsRef.current.get(time)!
        dateActionsRef.current.set(time, bundledAction(prevAction, action))
        return
      }
      console.info('[DateProvider] Register action', time)
      dateActionsRef.current.set(time, action)
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
