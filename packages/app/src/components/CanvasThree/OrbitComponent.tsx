import React from 'react'
import { Orbit, isOrbitElliptical } from '@othrworld/orbit'

import { OrbitEllipseComponent } from './OrbitEllipse'
import { OrbitItem } from './OrbitItem'

interface OrbitComponentProps {
  orbit: Orbit
}
export const OrbitComponent: React.FC<OrbitComponentProps> = ({
  orbit,
  children,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  return (
    <>
      <group
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {isOrbitElliptical(orbit) && (
          <OrbitEllipseComponent isHovered={isHovered} orbit={orbit} />
        )}
      </group>
      <OrbitItem orbit={orbit}>{children}</OrbitItem>
    </>
  )
}
