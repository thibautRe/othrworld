import React from 'react'
import { isOrbitElliptical, Orbit } from '@othrworld/core'
import { getApoapsis, getPeriapsis } from '@othrworld/orbital-mechanics'
import { radialToCarth } from '@othrworld/orbital-mechanics/dist/coords'
import { styled } from '@othrworld/stitches-config'

import { useFixedSizeAdapter, useToScaleAdapter } from './SVGView'

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
  const fixed = useFixedSizeAdapter()
  const toScale = useToScaleAdapter()

  const pericenter = radialToCarth({ angle: orbit.phi, r: getPeriapsis(orbit) })
  const apocenter =
    isOrbitElliptical(orbit) &&
    radialToCarth({
      angle: orbit.phi + Math.PI,
      r: getApoapsis(orbit),
    })

  return (
    <OrbitPointsGroup style={{ opacity: isHovered ? 1 : 0 }}>
      <OrbitPointCircle
        r={fixed(2)}
        cx={toScale(pericenter.x)}
        cy={toScale(pericenter.y)}
      />
      {apocenter && (
        <OrbitPointCircle
          r={fixed(2)}
          cx={toScale(apocenter.x)}
          cy={toScale(apocenter.y)}
        />
      )}
    </OrbitPointsGroup>
  )
}
