import React from 'react'
import { Planet } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'

import { useCanvasView } from '../../providers/CanvasViewProvider'
import { adaptDistanceToSVG } from '../../utils/distanceAdapter'
import { OrbitItem } from './OrbitItem'
import { OrbitEllipse } from './OrbitEllipse'

const PlanetReal = styled.circle({
  fill: '$planet',
})
const PlanetIcon = styled.circle({
  fill: '$planet',
  opacity: 0.3,
})
const PlanetText = styled.text({
  fill: 'white',
  textAnchor: 'middle',
  transition: 'opacity 200ms',
})

interface PlanetProps {
  planet: Planet
  parent?: Planet
}
export const PlanetComponent = ({ planet, parent }: PlanetProps) => {
  const { transform } = useCanvasView()
  const { k } = transform

  const textFontSize = 10 / k
  // If the planet's visual radius is above N px, show the name
  const textOpacity = adaptDistanceToSVG(planet.orbit.a) * k > 50 ? 1 : 0

  return (
    <OrbitItem orbit={parent?.orbit}>
      <OrbitItem orbit={planet.orbit}>
        <PlanetReal
          r={adaptDistanceToSVG(planet.radius)}
          data-dbg-r={planet.radius}
        />
        <PlanetIcon r={5 / k} />
        <PlanetText
          y={adaptDistanceToSVG(planet.radius) + textFontSize}
          fontSize={textFontSize}
          style={{ opacity: textOpacity }}
        >
          {planet.name}
        </PlanetText>
      </OrbitItem>

      <OrbitEllipse orbit={planet.orbit} />
    </OrbitItem>
  )
}
