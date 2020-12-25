import React from 'react'

import { PlanetComponent } from './PlanetComponent'
import { useSystem } from '../../providers/SystemProvider'

export const SystemComponent = () => {
  const system = useSystem()

  return (
    <>
      <circle style={{ fill: '#fcef99' }} r={30} />
      {system.planets.map((planet) => (
        <PlanetComponent
          key={planet.id}
          planet={planet}
          parent={
            planet.parentId &&
            system.planets.find(({ id }) => id === planet.parentId!)!
          }
        />
      ))}
    </>
  )
}
