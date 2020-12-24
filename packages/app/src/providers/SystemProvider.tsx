import React from 'react'
import { System } from '@othrworld/core'
import { generateSystem } from '@othrworld/systemgen'

// @ts-expect-error uninitialized system here
const SystemContext = React.createContext<System>(null)

export const SystemProvider: React.FC = ({ children }) => {
  const [system, setSystem] = React.useState(generateSystem)

  // DEBUG: regenerate the system when pressing "r"
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'r') setSystem(generateSystem())
    }
    window.addEventListener('keypress', listener)
    return () => window.removeEventListener('keypress', listener)
  }, [])

  // Update system
  React.useEffect(() => {
    const run = () => {
      setSystem((s) => ({
        ...s,
        planets: s.planets.map((p) => ({
          ...p,
          // Update planet orbit angle
          orbitAngle: p.orbitAngle + 100 / p.distance ** 2,
        })),
      }))
      frame = requestAnimationFrame(run)
    }
    let frame = window.requestAnimationFrame(run)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
  )
}

export const useSystem = () => React.useContext(SystemContext)
