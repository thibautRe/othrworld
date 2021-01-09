import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { Star } from '@othrworld/core'

import { useFixedSizeAdapter, useToScaleAdapter } from './SVGView'

const StarReal = styled.circle({
  fill: '$sol',
})
const StarIcon = styled.circle({
  fill: '$sol',
  opacity: 0.4,
})

export const StarComponent: React.FC<{ star: Star }> = ({ star, children }) => {
  const fixed = useFixedSizeAdapter()
  const toScale = useToScaleAdapter()
  return (
    <>
      {children}
      <StarReal r={toScale(star.radius)} />
      <StarIcon r={fixed(10)} />
    </>
  )
}
