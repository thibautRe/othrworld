import React from 'react'

import { PlanetComponent } from './PlanetComponent'
import { useSystem } from '../../providers/SystemProvider'
import { SolComponent } from './SolComponent'
import { SpacecraftComponent } from './SpacecraftComponent'
import { Planet, System } from '@othrworld/core'

interface PlanetTreeProps {
  planet: Planet
  system: System
}
// Recursive component to draw planets in subsequent orbits
const PlanetTree = ({ planet, system }: PlanetTreeProps) => (
  <PlanetComponent planet={planet}>
    {system.planets
      .filter((p) => p.parentId === planet.id)
      .map((p) => (
        <PlanetTree key={p.id} planet={p} system={system} />
      ))}
    {system.spacecrafts
      .filter((s) => s.parentId === planet.id)
      .map((spacecraft) => (
        <SpacecraftComponent key={spacecraft.id} spacecraft={spacecraft} />
      ))}
  </PlanetComponent>
)

export const SystemComponent = () => {
  const system = useSystem()

  return (
    <>
      <SolComponent radius={30} />
      {system.planets
        .filter((p) => !p.parentId)
        .map((planet) => (
          <PlanetTree key={planet.id} planet={planet} system={system} />
        ))}
    </>
  )
}
