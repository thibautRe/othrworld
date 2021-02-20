import React from 'react'
import { Spacecraft } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'

import { OrbitComponent } from './OrbitComponent'
import { useCanvasTooltipStore } from '../../stores/canvasTooltips'
import { useFixedSizeAdapter, useToScaleAdapter } from './SVGView'

const SpacecraftDot = styled.circle({
  fill: 'white',
})
const SpacecraftGuardDot = styled.circle({
  opacity: 0,
})
const Text = styled.text({
  fill: 'white',
  textAnchor: 'middle',
  transition: 'opacity 200ms',
})

interface SpacecraftComponentProps {
  spacecraft: Spacecraft
}
export const SpacecraftComponent = ({
  spacecraft,
}: SpacecraftComponentProps) => {
  const fixed = useFixedSizeAdapter()
  const toScale = useToScaleAdapter()
  const fontSize = fixed(10)

  const visualRadius = toScale(spacecraft.orbit.a)
  const textOpacity = visualRadius > fixed(50) ? 1 : 0
  const ellipseOpacity = visualRadius > fixed(20) ? 1 : 0

  return (
    <OrbitComponent
      orbit={spacecraft.orbit}
      OrbitEllipseProps={{ style: { opacity: ellipseOpacity } }}
    >
      <g
        onClick={(e) =>
          useCanvasTooltipStore
            .getState()
            .open(e, { type: 'spacecraft', id: spacecraft.id })
        }
      >
        <SpacecraftGuardDot r={fixed(15)} />
        <SpacecraftDot r={fixed(2)} />
        <Text y={fontSize} fontSize={fontSize} style={{ opacity: textOpacity }}>
          {spacecraft.name}
        </Text>
      </g>
    </OrbitComponent>
  )
}
