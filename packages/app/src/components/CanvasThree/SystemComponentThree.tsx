import React from 'react'
import { Body, Spacecraft, System } from '@othrworld/core'

import { useSystemStore } from '../../stores/system'

const BodyComponent: React.FC<{ body: Body }> = ({ body, children }) => {
  switch (body.type) {
    case 'planet':
      return null
    case 'star':
      return null
    case 'asteroid':
      // TODO
      return null
  }
}
const SpacecraftComponent: React.FC<{ spacecraft: Spacecraft }> = () => null

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

export const SystemComponentThree = () => {
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
