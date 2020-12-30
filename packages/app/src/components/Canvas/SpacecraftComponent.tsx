import React from 'react'
import { Planet, Spacecraft } from '@othrworld/core'
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
  parent: Planet
}
export const SpacecraftComponent = ({
  spacecraft,
  parent,
}: SpacecraftComponentProps) => {
  const { transform } = useCanvasView()
  const { k } = transform
  const fontSize = 10 / k
  const opacity = adaptDistanceToSVG(spacecraft.orbit.a) * k > 50 ? 1 : 0
  return (
    <OrbitItem orbit={parent.orbit}>
      <OrbitItem orbit={spacecraft.orbit}>
        <SpacecraftDot r={2 / k} />
        <Text y={fontSize} fontSize={fontSize} style={{ opacity }}>
          {spacecraft.name}
        </Text>
      </OrbitItem>
      <OrbitEllipse orbit={spacecraft.orbit} />
    </OrbitItem>
  )
}
