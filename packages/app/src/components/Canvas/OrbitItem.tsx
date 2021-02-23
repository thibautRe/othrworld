import React from 'react'
import { Orbit, getCarthesianCoords } from '@othrworld/orbital-mechanics'

import { useCurrentDate } from '../../stores/date'
import { useToScaleAdapter } from './SVGView'

/** Translation group for an orbit */
interface OrbitItemProps extends React.SVGAttributes<SVGGElement> {
  orbit: Orbit
}
export const OrbitItem: React.FC<OrbitItemProps> = ({
  orbit,
  children,
  ...props
}) => {
  const currentDate = useCurrentDate()
  const toScale = useToScaleAdapter()
  const { x, y } = getCarthesianCoords(orbit, currentDate)

  return (
    <g transform={`translate(${toScale(x)} ${toScale(y)})`} {...props}>
      {children}
    </g>
  )
}
