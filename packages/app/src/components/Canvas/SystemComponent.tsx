import React from 'react'
import { generateSystem } from '@othrworld/systemgen'
import { PlanetComponent } from './PlanetComponent'

export const SystemComponent = () => {
  const [system, setSystem] = React.useState(generateSystem)

  // DEBUG: regenerate the system when pressing "r"
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'r') {
        setSystem(generateSystem())
      }
    }
    window.addEventListener('keypress', listener)
    return () => window.removeEventListener('keypress', listener)
  }, [])

  return (
    <>
      <circle style={{ fill: '#fcef99' }} r={30} />
      {system.planets.map((planet) => (
        <PlanetComponent planet={planet} key={planet.id} />
      ))}
    </>
  )
}
