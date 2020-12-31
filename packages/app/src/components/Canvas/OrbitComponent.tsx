import { Orbit } from '@othrworld/core'
import React from 'react'
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
      </g>
      <OrbitPoints isHovered={isHovered} orbit={orbit} />
      <OrbitItem orbit={orbit}>{children}</OrbitItem>
    </>
  )
}
