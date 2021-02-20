import React from 'react'
import { Orbit } from '@othrworld/core'

import { OrbitEllipse, OrbitEllipseProps } from './OrbitEllipse'
import { OrbitItem } from './OrbitItem'
import { OrbitPoints } from './OrbitPoint'

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
  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {orbit.e < 1 && (
          <>
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
          </>
        )}
        <OrbitPoints isHovered={isHovered} orbit={orbit} />
      </g>
      <OrbitItem orbit={orbit}>{children}</OrbitItem>
    </>
  )
}
