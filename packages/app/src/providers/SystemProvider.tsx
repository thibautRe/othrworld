import React from 'react'
import { Planet, System } from '@othrworld/core'
import { generateDebugSystem, generateSystem } from '@othrworld/systemgen'
import { useFrame } from '../hooks/useFrame'
import { getTrueAnomaly } from '@othrworld/orbital-mechanics'

// @ts-expect-error uninitialized system here
const SystemContext = React.createContext<System>(null)
const PlayPauseContext = React.createContext<boolean>(true)

let t = 0
const systemTick = (s: System): System => {
  t+=1000
  return {
    ...s,
    planets: s.planets.map(
      (p): Planet => ({
        ...p,
        // Update planet orbit angle
        orbit: {
          ...p.orbit,
          angle: getTrueAnomaly(p.orbit, 100000, t, 0),
        },
      })
    ),
  }
}

export const SystemProvider: React.FC = ({ children }) => {
  const [system, setSystem] = React.useState(generateSystem)
  const [isPlay, setIsPlay] = React.useState(true)

  // Keyboard event listeners
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'r') setSystem(generateSystem())
      if (e.key === 'd') setSystem(generateDebugSystem())
      if (e.key === ' ') setIsPlay((p) => !p)
    }
    window.addEventListener('keypress', listener)
    return () => window.removeEventListener('keypress', listener)
  }, [])

  const updateSystem = React.useCallback(() => {
    setSystem(systemTick)
  }, [])

  useFrame(isPlay ? updateSystem : null)

  return (
    <SystemContext.Provider value={system}>
      <PlayPauseContext.Provider value={isPlay}>
        {children}
      </PlayPauseContext.Provider>
    </SystemContext.Provider>
  )
}

export const useSystem = () => React.useContext(SystemContext)
export const usePlayPause = () => React.useContext(PlayPauseContext)
