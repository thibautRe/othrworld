import React from 'react'
import { Planet } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'

import { useScaleAdapter } from './SVGView'

const AtmosphereCircle = styled.circle({
  fill: '#a4e3fc',
})

interface AtmosphereComponentProps {
  planet: Planet
}
export const AtmosphereComponent = ({
  planet: { radius, atmosphere },
}: AtmosphereComponentProps) => {
  const adapter = useScaleAdapter()
  return (
    <AtmosphereCircle
      r={adapter(radius + atmosphere.altitudeHalf * 20)}
      style={{ opacity: (0.2 * atmosphere.density) / 1e9 }}
    />
  )
}
