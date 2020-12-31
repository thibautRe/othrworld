import { Orbit } from '@othrworld/core'
import React from 'react'
import { OrbitEllipse, OrbitEllipseProps } from './OrbitEllipse'
import { OrbitItem } from './OrbitItem'
import { OrbitPoints } from './OrbitPoint'

interface OrbitComponentProps {
  orbit: Orbit
  OrbitEllipseProps?: Omit<OrbitEllipseProps, 'orbit'>
}
export const OrbitComponent: React.FC<OrbitComponentProps> = ({
  orbit,
  OrbitEllipseProps = {},
  children,
}) => {
  return (
    <>
      <OrbitEllipse orbit={orbit} {...OrbitEllipseProps} />
      <OrbitPoints orbit={orbit} />
      <OrbitItem orbit={orbit}>{children}</OrbitItem>
    </>
  )
}
