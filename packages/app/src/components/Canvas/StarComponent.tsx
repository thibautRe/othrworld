import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { Star } from '@othrworld/core'

import { OrbitComponent } from './OrbitComponent'
import { useFixedSizeAdapter, useScaleAdapter } from './SVGView'

const StarReal = styled.circle({
  fill: '$sol',
})
const StarIcon = styled.circle({
  fill: '$sol',
  opacity: 0.4,
})

export const StarComponent: React.FC<{ star: Star }> = ({ star, children }) => {
  const fixed = useFixedSizeAdapter()
  const adapter = useScaleAdapter()
  return (
    <OrbitComponent orbit={star.orbit}>
      {children}
      <StarReal r={adapter(star.radius)} />
      <StarIcon r={fixed(10)} />
    </OrbitComponent>
  )
}
