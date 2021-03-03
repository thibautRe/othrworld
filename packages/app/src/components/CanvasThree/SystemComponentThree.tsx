import React from 'react'
import { Body, Planet, Spacecraft, Star, System } from '@othrworld/core'

import { useSystemStore } from '../../stores/system'
import { useFixedSizeAdapter, useToScaleAdapter } from './hooks'
import { OrbitComponent } from './OrbitComponent'
import { useCanvasTooltipStore } from '../../stores/canvasTooltips'

const StarComponent: React.FC<{ star: Star }> = ({ star, children }) => {
  const toScale = useToScaleAdapter()
  const fixed = useFixedSizeAdapter()
  return (
    <>
      <mesh>
        <sphereGeometry args={[toScale(star.radius), 32, 32]} />
        <meshLambertMaterial color="#fcef99" opacity={0.6} transparent />
      </mesh>
      <mesh scale={[fixed(10), fixed(10), 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#fcef99" opacity={0.2} transparent />
      </mesh>
      <pointLight args={['#fcef99', 1]} />
      {children}
    </>
  )
}

const PlanetComponent: React.FC<{ planet: Planet }> = ({
  planet,
  children,
}) => {
  const toScale = useToScaleAdapter()
  const fixed = useFixedSizeAdapter()
  const r = toScale(planet.radius)
  return (
    <OrbitComponent orbit={planet.orbit}>
      <group
        onPointerDown={(e) =>
          useCanvasTooltipStore
            .getState()
            .open(e, { type: 'planet', id: planet.id })
        }
      >
        {/* Real planet */}
        <mesh scale={[r, r, r]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshLambertMaterial color="#5f5c59" opacity={0.6} transparent />
        </mesh>

        {/* Planet Icon */}
        <mesh scale={[fixed(8), fixed(8), 1]}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial color="#5f5c59" opacity={0.2} transparent />
        </mesh>
        {children}
      </group>
    </OrbitComponent>
  )
}

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
