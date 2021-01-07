import React from 'react'
import { Orbit } from '@othrworld/core'
import { getApoapsis, getPeriapsis } from '@othrworld/orbital-mechanics'
import { radialToCarth } from '@othrworld/orbital-mechanics/dist/coords'
import { styled } from '@othrworld/stitches-config'

import {
  useCanvasTransform,
  useScaleAdapter,
} from '../../providers/CanvasViewProvider'

const OrbitPointsGroup = styled.g({
  transition: 'opacity .2s',
})
const OrbitPointCircle = styled.circle({
  fill: '$orbit',
  opacity: 0.2,
})

interface OrbitPointsProps {
  orbit: Orbit
  isHovered: boolean
}
export const OrbitPoints = ({ orbit, isHovered }: OrbitPointsProps) => {
  const { k } = useCanvasTransform()
  const adapter = useScaleAdapter()

  const pericenter = radialToCarth({ angle: orbit.phi, r: getPeriapsis(orbit) })
  const apocenter = radialToCarth({
    angle: orbit.phi + Math.PI,
    r: getApoapsis(orbit),
  })

  return (
    <OrbitPointsGroup style={{ opacity: isHovered ? 1 : 0 }}>
      <OrbitPointCircle
        r={2 / k}
        cx={adapter(pericenter.x)}
        cy={adapter(pericenter.y)}
      />
      <OrbitPointCircle
        r={2 / k}
        cx={adapter(apocenter.x)}
        cy={adapter(apocenter.y)}
      />
    </OrbitPointsGroup>
  )
}
