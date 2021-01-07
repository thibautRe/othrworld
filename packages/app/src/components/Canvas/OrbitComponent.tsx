import React from 'react'
import { Orbit } from '@othrworld/core'
import { getSpeedVector } from '@othrworld/orbital-mechanics'

import { useCurrentDate } from '../../stores/date'
import { OrbitEllipse, OrbitEllipseProps } from './OrbitEllipse'
import { OrbitItem } from './OrbitItem'
import { OrbitPoints } from './OrbitPoint'
import { useFixedSizeAdapter } from './SVGView'

interface OrbitComponentProps {
  orbit: Orbit
  OrbitEllipseProps?: Omit<OrbitEllipseProps, 'orbit' | 'isHovered'>
}
export const OrbitComponent: React.FC<OrbitComponentProps> = ({
  orbit,
  OrbitEllipseProps = {},
  children,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const currentDate = useCurrentDate()
  const speedVec = getSpeedVector(orbit, currentDate)
  const fixed = useFixedSizeAdapter()
  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <OrbitEllipse
          isHovered={isHovered}
          orbit={orbit}
          {...OrbitEllipseProps}
        />
        {/* Gard ellipse */}
        <OrbitEllipse
          isHovered={false}
          orbit={orbit}
          baseStrokeWidth={15}
          style={{ opacity: 0 }}
        />
        <OrbitPoints isHovered={isHovered} orbit={orbit} />
      </g>
      <OrbitItem orbit={orbit}>
        {children}
        {speedVec.x && speedVec.y && (
          <line
            x1={0}
            y1={0}
            x2={fixed(speedVec.x * 10)}
            y2={fixed(speedVec.y * 10)}
            strokeWidth={fixed(2)}
            stroke="yellow"
          />
        )}
      </OrbitItem>
    </>
  )
}
