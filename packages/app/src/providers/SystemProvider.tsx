import React from 'react'

import { Planet, System } from '@othrworld/core'
import { generateDebugSystem, generateSystem } from '@othrworld/systemgen'
import { getTrueAnomaly } from '@othrworld/orbital-mechanics'

import { useDateContext } from './DateProvider'

// @ts-expect-error uninitialized system here
const SystemContext = React.createContext<System>(null)

const getSystemAtDate = (s: System, date: Date): System => {
  return {
    ...s,
    planets: s.planets.map(
      (p): Planet => ({
        ...p,
        // Update planet orbit angle
        orbit: {
          ...p.orbit,
          angle: getTrueAnomaly(p.orbit, date),
        },
      })
    ),
  }
}

export const SystemProvider: React.FC = ({ children }) => {
  const [system, setSystem] = React.useState(generateSystem)
  const { currentDate, resetCurrentDate } = useDateContext()

  // Keyboard event listeners
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'r') {
        setSystem(generateSystem())
        resetCurrentDate()
      }
      if (e.key === 'd') {
        setSystem(generateDebugSystem())
        resetCurrentDate()
      }
    }
    window.addEventListener('keypress', listener)
    return () => window.removeEventListener('keypress', listener)
  }, [resetCurrentDate])

  const systemAtDate = React.useMemo(
    () => getSystemAtDate(system, currentDate),
    [system, currentDate]
  )

  return (
    <SystemContext.Provider value={systemAtDate}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystem = () => React.useContext(SystemContext)
