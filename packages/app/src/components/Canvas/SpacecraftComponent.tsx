import React from 'react'
import { Spacecraft } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'

import { OrbitItem } from './OrbitItem'
import { useCanvasView } from '../../providers/CanvasViewProvider'
import { adaptDistanceToSVG } from '../../utils/distanceAdapter'
import { OrbitEllipse } from './OrbitEllipse'

const SpacecraftDot = styled.circle({
  fill: 'white',
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
  const { transform } = useCanvasView()
  const { k } = transform
  const fontSize = 10 / k
  const visualRadius = adaptDistanceToSVG(spacecraft.orbit.a) * k

  const textOpacity = visualRadius > 50 ? 1 : 0
  const ellipseOpacity = visualRadius > 20 ? 1 : 0

  const orbitStrokeDash = adaptDistanceToSVG(spacecraft.orbit.a) / 30

  return (
    <>
      <OrbitEllipse
        orbit={spacecraft.orbit}
        style={{
          strokeDasharray: `${orbitStrokeDash} ${orbitStrokeDash}`,
          opacity: ellipseOpacity,
        }}
      />
      <OrbitItem orbit={spacecraft.orbit}>
        <SpacecraftDot r={2 / k} />
        <Text y={fontSize} fontSize={fontSize} style={{ opacity: textOpacity }}>
          {spacecraft.name}
        </Text>
      </OrbitItem>
    </>
  )
}
