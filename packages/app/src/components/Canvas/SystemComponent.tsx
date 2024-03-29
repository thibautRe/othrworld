import React from 'react'
import { Body, System } from '@othrworld/core'

import { PlanetComponent } from './PlanetComponent'
import { StarComponent } from './StarComponent'
import { SpacecraftComponent } from './SpacecraftComponent'
import { useSystemStore } from '../../stores/system'

const BodyComponent: React.FC<{ body: Body }> = ({ body, children }) => {
  switch (body.type) {
    case 'planet':
      return <PlanetComponent planet={body}>{children}</PlanetComponent>
    case 'star':
      return <StarComponent star={body}>{children}</StarComponent>
    case 'asteroid':
      // TODO
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
      .filter((b) => b.type !== 'star' && b.orbit.parentId === body.id)
      .map((b) => (
        <BodyTree key={b.id} body={b} system={system} />
      ))}
    {system.spacecrafts
      .filter((s) => s.orbit.parentId === body.id)
      .map((spacecraft) => (
        <SpacecraftComponent key={spacecraft.id} spacecraft={spacecraft} />
      ))}
  </BodyComponent>
)

export const SystemComponent = () => {
  const system = useSystemStore((s) => s.system)

  return (
    <>
      {system.bodies
        .filter((b) => b.type === 'star')
        .map((body) => (
          <BodyTree key={body.id} body={body} system={system} />
        ))}
    </>
  )
}
