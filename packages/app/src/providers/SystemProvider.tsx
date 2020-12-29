import React from 'react'

import { System } from '@othrworld/core'
import { generateDebugSystem, generateSystem } from '@othrworld/systemgen'

import { useDateContext } from './DateProvider'

// @ts-expect-error uninitialized system here
const SystemContext = React.createContext<System>(null)

export const SystemProvider: React.FC = ({ children }) => {
  const [system, setSystem] = React.useState(generateSystem)
  const { resetCurrentDate } = useDateContext()

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

  return (
    <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
  )
}

export const useSystem = () => React.useContext(SystemContext)
