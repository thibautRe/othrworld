import React from 'react'
import { Orbit } from '@othrworld/core'
import { getCarthesianCoords } from '@othrworld/orbital-mechanics'

import { useCurrentDate } from '../../stores/date'
import { useScaleAdapter } from './SVGView'

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
  const adapter = useScaleAdapter()
  const { x, y } = getCarthesianCoords(orbit, currentDate)

  return (
    <g transform={`translate(${adapter(x)} ${adapter(y)})`} {...props}>
      {children}
    </g>
  )
}
