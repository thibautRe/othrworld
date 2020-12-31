import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { Orbit } from '@othrworld/core'
import { getSemiMinorAxis } from '@othrworld/orbital-mechanics'

import { useCanvasView } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'

const OrbitEll = styled.ellipse({
  stroke: '$orbit',
  opacity: 0.5,
  transition: 'opacity .2s',
})

interface OrbitEllipseProps extends React.SVGAttributes<SVGEllipseElement> {
  orbit: Orbit
}
export const OrbitEllipse = ({ orbit, ...props }: OrbitEllipseProps) => {
  const { transform } = useCanvasView()
  const { k } = transform
  const adapter = useScaleAdapter()
  return (
    <OrbitEll
      rx={adapter(orbit.a)}
      ry={adapter(getSemiMinorAxis(orbit))}
      transform={`
        rotate(${(orbit.phi * 360) / (Math.PI * 2)})
        translate(${-adapter(orbit.a * orbit.e)} 0)
      `}
      strokeWidth={1 / k}
      {...props}
    />
  )
}
