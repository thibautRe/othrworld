import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { getSemiMinorAxis, OrbitEllipse } from '@othrworld/orbital-mechanics'

import { useFixedSizeAdapter, useToScaleAdapter } from './SVGView'

const OrbitEll = styled.ellipse({
  stroke: '$orbit',
  transition: 'opacity .2s',
})

export interface OrbitEllipseProps
  extends React.SVGAttributes<SVGEllipseElement> {
  orbit: OrbitEllipse
  isHovered: boolean
  baseStrokeWidth?: number
}
export const OrbitEllipseComponent = ({
  orbit,
  isHovered,
  baseStrokeWidth = 1,
  ...props
}: OrbitEllipseProps) => {
  const fixed = useFixedSizeAdapter()
  const toScale = useToScaleAdapter()
  return (
    <OrbitEll
      rx={toScale(orbit.a)}
      ry={toScale(getSemiMinorAxis(orbit))}
      transform={`
        rotate(${(orbit.phi * 360) / (Math.PI * 2)})
        translate(${-toScale(orbit.a * orbit.e)} 0)
      `}
      strokeWidth={fixed(baseStrokeWidth)}
      style={{
        opacity: isHovered ? 0.4 : 0.1,
        transition: isHovered ? 'none' : undefined,
        ...(props.style || {}),
      }}
      {...props}
    />
  )
}
