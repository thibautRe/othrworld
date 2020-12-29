import React from 'react'
import { useFrame } from '../hooks/useFrame'
import { useKeyListener } from '../hooks/useKeyListener'

interface DateContext {
  currentDate: Date
  /** Represents the time multiplication */
  currentTimeMult: number

  resetCurrentDate: () => void
}
const DateContext = React.createContext<DateContext>({
  currentDate: new Date(),
  currentTimeMult: 1,
  resetCurrentDate: () => {},
})
const PlayPauseContext = React.createContext(true)

export const DateProvider: React.FC = ({ children }) => {
  const [currentDate, setCurrentDate] = React.useState(() => new Date())
  const [currentTimeMult, setCurrentTimeMult] = React.useState(1000)
  const [isPlay, setIsPlay] = React.useState(true)

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

  useFrame(
    isPlay
      ? () => {
          setCurrentDate((cd) => {
            const nd = new Date()
            nd.setTime(cd.getTime() + currentTimeMult)
            return nd
          })
        }
      : null
  )

  const resetCurrentDate = React.useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  return (
    <DateContext.Provider
      value={{ currentDate, currentTimeMult, resetCurrentDate }}
    >
      <PlayPauseContext.Provider value={isPlay}>
        {children}
      </PlayPauseContext.Provider>
    </DateContext.Provider>
  )
}

export const useDateContext = () => React.useContext(DateContext)
export const useCurrentDate = () => useDateContext().currentDate

export const usePlayPause = () => React.useContext(PlayPauseContext)
