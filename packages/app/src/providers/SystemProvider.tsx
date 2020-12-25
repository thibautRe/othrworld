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
    let playPause: 0 | 1 = 1
    const run = () => {
      setSystem((s) => ({
        ...s,
        planets: s.planets.map((p) => ({
          ...p,
          // Update planet orbit angle
          orbitAngle:
            p.orbitAngle +
            (p.parentId
              ? s.planets.find(({ id }) => id === p.parentId!)!.radius ** 3
              : 100) /
              p.distance ** 2,
        })),
      }))
      frame = requestAnimationFrame(run)
    }
    let frame = window.requestAnimationFrame(run)

    const playPauseListener = (e: KeyboardEvent) => {
      // Space key
      if (e.key === ' ') {
        // @ts-expect-error "number" is not assignable to 0 | 1
        playPause = 1 - playPause
        if (playPause) frame = requestAnimationFrame(run)
        else cancelAnimationFrame(frame)
      }
    }
    window.addEventListener('keypress', playPauseListener)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('keypress', playPauseListener)
    }
  }, [])

  return (
    <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
  )
}

export const useSystem = () => React.useContext(SystemContext)
