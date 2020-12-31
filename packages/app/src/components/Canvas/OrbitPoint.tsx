import { Orbit } from '@othrworld/core'
import { getApoapsis, getPeriapsis } from '@othrworld/orbital-mechanics'
import { radialToCarth } from '@othrworld/orbital-mechanics/dist/coords'
import { styled } from '@othrworld/stitches-config'
import React from 'react'
import { useCanvasView } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'

const OrbitPointCircle = styled.circle({
  fill: '$orbit',
  opacity: 0.2,
})

interface OrbitPointsProps {
  orbit: Orbit
}
export const OrbitPoints = ({ orbit }: OrbitPointsProps) => {
  const { transform } = useCanvasView()
  const adapter = useScaleAdapter()
  const { k } = transform

  const pericenter = radialToCarth({ angle: orbit.phi, r: getPeriapsis(orbit) })
  const apocenter = radialToCarth({
    angle: orbit.phi + Math.PI,
    r: getApoapsis(orbit),
  })

  return (
    <>
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
    </>
  )
}
