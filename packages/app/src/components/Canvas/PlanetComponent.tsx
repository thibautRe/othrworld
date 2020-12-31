import React from 'react'
import { Planet } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'

import { useCanvasView } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'
import { AtmosphereComponent } from './AtmosphereComponent'
import { OrbitComponent } from './OrbitComponent'

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

interface PlanetComponentProps {
  planet: Planet
}
export const PlanetComponent: React.FC<PlanetComponentProps> = ({
  planet,
  children,
}) => {
  const { transform } = useCanvasView()
  const { k } = transform
  const adapter = useScaleAdapter()

  const textFontSize = 10 / k
  // If the planet's visual radius is above N px, show the name
  const textOpacity = adapter(planet.orbit.a) * k > 50 ? 1 : 0

  return (
    <OrbitComponent orbit={planet.orbit}>
      {children}
      <PlanetReal r={adapter(planet.radius)} data-dbg-r={planet.radius} />
      <AtmosphereComponent planet={planet} />
      <PlanetIcon r={5 / k} />
      <PlanetText
        y={adapter(planet.radius) + textFontSize}
        fontSize={textFontSize}
        style={{ opacity: textOpacity }}
      >
        {planet.name}
      </PlanetText>
    </OrbitComponent>
  )
}
