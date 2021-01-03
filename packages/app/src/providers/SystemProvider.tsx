import React from 'react'

import { Spacecraft, System } from '@othrworld/core'
import {
  generateDebugSystem,
  generateSolarSystem,
  generateSystem,
} from '@othrworld/systemgen'

import { useDateContext } from './DateProvider'

interface SystemContext {
  system: System
  setSystem: (s: System) => void
  setSpacecraft: (
    spacecraftId: Spacecraft['id'],
    setter: (s: Spacecraft) => Spacecraft
  ) => void
}

const errorCallback = () => {
  throw new Error('No SystemProvider found')
}
const SystemContext = React.createContext<SystemContext>({
  // @ts-expect-error uninitialized system
  system: null,
  setSystem: errorCallback,
  setSpacecraft: errorCallback,
})

export const SystemProvider: React.FC = ({ children }) => {
  const [system, setSystem] = React.useState(generateSystem)
  const { resetCurrentDate } = useDateContext()

  // Keyboard event listeners
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'r') {
        setSystem(generateSystem())
        resetCurrentDate()
      } else if (e.key === 'd') {
        setSystem(generateDebugSystem())
        resetCurrentDate()
      } else if (e.key === 's') {
        setSystem(generateSolarSystem())
        resetCurrentDate()
      }
    }
    window.addEventListener('keypress', listener)
    return () => window.removeEventListener('keypress', listener)
  }, [resetCurrentDate])

  const setSpacecraft: SystemContext['setSpacecraft'] = React.useCallback(
    (id, setter) => {
      setSystem((s) => {
        const spacecraftIndex = s.spacecrafts.findIndex((sp) => sp.id === id)
        return {
          ...s,
          spacecrafts: [
            ...s.spacecrafts.slice(0, spacecraftIndex),
            setter(s.spacecrafts[spacecraftIndex]),
            ...s.spacecrafts.slice(spacecraftIndex + 1),
          ],
        }
      })
    },
    []
  )

  return (
    <SystemContext.Provider value={{ system, setSystem, setSpacecraft }}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystemContext = () => React.useContext(SystemContext)
export const useSystem = () => useSystemContext().system
