import React from 'react'
import shallow from 'zustand/shallow'
import { Body, Planet, Spacecraft, Star } from '@othrworld/core'
import { unit } from '@othrworld/units'

import { useSystemStore, SystemState } from '../../stores/system'
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
      </group>
      {children}
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
const SpacecraftComponent = ({ spacecraft }: { spacecraft: Spacecraft }) => {
  const fixed = useFixedSizeAdapter()
  const toScale = useToScaleAdapter()
  return (
    <OrbitComponent orbit={spacecraft.orbit}>
      <group
        onPointerDown={(e) =>
          useCanvasTooltipStore
            .getState()
            .open(e, { type: 'spacecraft', id: spacecraft.id })
        }
      >
        <mesh scale={[fixed(2), fixed(2), 1]}>
          <circleGeometry args={[1, 8]} />
          <meshBasicMaterial color="#888888" />
        </mesh>
        <mesh scale={[toScale(unit(5)), toScale(unit(5)), 1]}>
          <circleGeometry args={[1, 8]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
        <mesh scale={[fixed(10), fixed(10), 1]}>
          <circleGeometry args={[1, 8]} />
          <meshBasicMaterial opacity={0} transparent />
        </mesh>
      </group>
    </OrbitComponent>
  )
}

interface BodyTreeProps {
  body: Body
}
// Recursive component to draw bodies in subsequent orbits
const BodyTree = ({ body }: BodyTreeProps) => {
  const subBodies = useSystemStore(
    React.useCallback(
      (s) =>
        s.system.bodies.filter(
          (b) => b.type !== 'star' && b.orbit.parentId === body.id
        ),
      [body.id]
    ),
    shallow
  )
  const spacecrafts = useSystemStore(
    React.useCallback(
      (s) => s.system.spacecrafts.filter((s) => s.orbit.parentId === body.id),
      [body.id]
    ),
    shallow
  )

  return (
    <BodyComponent body={body}>
      {subBodies.map((b) => (
        <BodyTree key={b.id} body={b} />
      ))}
      {spacecrafts.map((s) => (
        <SpacecraftComponent key={s.id} spacecraft={s} />
      ))}
    </BodyComponent>
  )
}

const starSelector = (s: SystemState) =>
  s.system.bodies.filter((b) => b.type === 'star')
export const SystemComponentThree = () => {
  const stars = useSystemStore(starSelector, shallow)

  return (
    <>
      {stars.map((star) => (
        <BodyTree key={star.id} body={star} />
      ))}
    </>
  )
}
