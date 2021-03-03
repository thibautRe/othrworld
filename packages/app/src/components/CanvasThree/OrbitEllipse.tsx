import React from 'react'
import { getSemiMinorAxis, OrbitEllipse } from '@othrworld/orbit'
import { multUnit } from '@othrworld/units'

import { useToScaleAdapter } from './hooks'

export interface OrbitEllipseProps {
  orbit: OrbitEllipse
  isHovered: boolean
  baseStrokeWidth?: number
}
export const OrbitEllipseComponent = ({
  orbit,
  isHovered,
  baseStrokeWidth = 1,
}: OrbitEllipseProps) => {
  const toScale = useToScaleAdapter()
  return (
    <line
      // @ts-expect-error `<line>` is a Three Line, not a SVG Line
      scale={[toScale(orbit.a), toScale(getSemiMinorAxis(orbit)), 0]}
      rotation={[0, 0, (orbit.phi * 360) / (Math.PI * 2)]}
      position={[-toScale(multUnit(orbit.a, orbit.e)), 0, 0]}
    >
      <circleGeometry args={[1, 32]} />
      <lineBasicMaterial />
    </line>
  )
}
