import React from 'react'
import { Spacecraft } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'

import { useCanvasTransform } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'
import { OrbitComponent } from './OrbitComponent'
import { useCanvasTooltipStore } from '../../stores/canvasTooltips'

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
  const { k } = useCanvasTransform()
  const adapter = useScaleAdapter()
  const fontSize = 10 / k
  const visualRadius = adapter(spacecraft.orbit.a) * k

  const textOpacity = visualRadius > 50 ? 1 : 0
  const ellipseOpacity = visualRadius > 20 ? 1 : 0

  const orbitStrokeDash = adapter(spacecraft.orbit.a) / 30

  return (
    <OrbitComponent
      orbit={spacecraft.orbit}
      OrbitEllipseProps={{
        style: {
          strokeDasharray: `${orbitStrokeDash} ${orbitStrokeDash}`,
          opacity: ellipseOpacity,
        },
      }}
    >
      <g
        onClick={(e) =>
          useCanvasTooltipStore
            .getState()
            .open(e, { type: 'spacecraft', id: spacecraft.id })
        }
      >
        <SpacecraftGuardDot r={15 / k} />
        <SpacecraftDot r={2 / k} />
        <Text y={fontSize} fontSize={fontSize} style={{ opacity: textOpacity }}>
          {spacecraft.name}
        </Text>
      </g>
    </OrbitComponent>
  )
}
