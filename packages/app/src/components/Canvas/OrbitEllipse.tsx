import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { Orbit } from '@othrworld/core'
import { adaptDistanceToSVG } from '../../utils/distanceAdapter'
import { useCanvasView } from '../../providers/CanvasViewProvider'
import { getSemiMinorAxis } from '@othrworld/orbital-mechanics'

const OrbitEll = styled.ellipse({
  stroke: '$orbit',
  opacity: 0.5,
})

interface OrbitEllipseProps {
  orbit: Orbit
}
export const OrbitEllipse = ({ orbit }: OrbitEllipseProps) => {
  const { transform } = useCanvasView()
  const { k } = transform
  return (
    <OrbitEll
      rx={adaptDistanceToSVG(orbit.a)}
      ry={adaptDistanceToSVG(getSemiMinorAxis(orbit))}
      transform={`
        rotate(${(orbit.phi * 360) / (Math.PI * 2)})
        translate(${-adaptDistanceToSVG(orbit.a * orbit.e)} 0)
      `}
      strokeWidth={1 / k}
    />
  )
}
