import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { Star } from '@othrworld/core'

import {
  useCanvasTransform,
  useScaleAdapter,
} from '../../providers/CanvasViewProvider'
import { OrbitComponent } from './OrbitComponent'

const StarReal = styled.circle({
  fill: '$sol',
})
const StarIcon = styled.circle({
  fill: '$sol',
  opacity: 0.4,
})

export const StarComponent: React.FC<{ star: Star }> = ({ star, children }) => {
  const { k } = useCanvasTransform()
  const adapter = useScaleAdapter()
  return (
    <OrbitComponent orbit={star.orbit}>
      {children}
      <StarReal r={adapter(star.radius)} />
      <StarIcon r={10 / k} />
    </OrbitComponent>
  )
}
