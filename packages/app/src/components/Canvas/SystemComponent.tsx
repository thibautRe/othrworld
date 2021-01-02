import React from 'react'

import { PlanetComponent } from './PlanetComponent'
import { useSystem } from '../../providers/SystemProvider'
import { SolComponent } from './SolComponent'
import { SpacecraftComponent } from './SpacecraftComponent'
import { Body, System } from '@othrworld/core'

const BodyComponent: React.FC<{ body: Body }> = ({ body, children }) => {
  switch (body.type) {
    case 'planet':
      return <PlanetComponent planet={body}>{children}</PlanetComponent>

    // TODO: render stars and asteroids
    case 'star':
    case 'asteroid':
      return null
  }
}

interface BodyTreeProps {
  body: Body
  system: System
}
// Recursive component to draw bodies in subsequent orbits
const BodyTree = ({ body, system }: BodyTreeProps) => (
  <BodyComponent body={body}>
    {system.bodies
      .filter((b) => b.parentId === body.id)
      .map((b) => (
        <BodyTree key={b.id} body={b} system={system} />
      ))}
    {system.spacecrafts
      .filter((s) => s.parentId === body.id)
      .map((spacecraft) => (
        <SpacecraftComponent key={spacecraft.id} spacecraft={spacecraft} />
      ))}
  </BodyComponent>
)

export const SystemComponent = () => {
  const system = useSystem()

  return (
    <>
      <SolComponent radius={30} />
      {system.bodies
        .filter((b) => !b.parentId)
        .map((body) => (
          <BodyTree key={body.id} body={body} system={system} />
        ))}
    </>
  )
}
