import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { Orbit } from '@othrworld/core'
import { getSemiMinorAxis } from '@othrworld/orbital-mechanics'

import { useCanvasTransform } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'

const OrbitEll = styled.ellipse({
  stroke: '$orbit',
  transition: 'opacity .2s',
})

export interface OrbitEllipseProps
  extends React.SVGAttributes<SVGEllipseElement> {
  orbit: Orbit
  isHovered: boolean
  baseStrokeWidth?: number
}
export const OrbitEllipse = ({
  orbit,
  isHovered,
  baseStrokeWidth = 1,
  ...props
}: OrbitEllipseProps) => {
  const { k } = useCanvasTransform()
  const adapter = useScaleAdapter()
  return (
    <OrbitEll
      rx={adapter(orbit.a)}
      ry={adapter(getSemiMinorAxis(orbit))}
      transform={`
        rotate(${(orbit.phi * 360) / (Math.PI * 2)})
        translate(${-adapter(orbit.a * orbit.e)} 0)
      `}
      strokeWidth={baseStrokeWidth / k}
      style={{
        opacity: isHovered ? 0.4 : 0.1,
        transition: isHovered ? 'none' : undefined,
        ...(props.style || {}),
      }}
      {...props}
    />
  )
}
