import React from 'react'
import { Orbit, getCarthesianCoords } from '@othrworld/orbit'

import { useCurrentDate } from '../../stores/date'
import { useToScaleAdapter } from './hooks'

/** Translation group for an orbit */
export const OrbitItem: React.FC<{ orbit: Orbit }> = ({ orbit, children }) => {
  const currentDate = useCurrentDate()
  const toScale = useToScaleAdapter()
  const { x, y } = getCarthesianCoords(orbit, currentDate)

  return <group position={[toScale(x), -toScale(y), 0]}>{children}</group>
}
