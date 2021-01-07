import React from 'react'
import { Planet } from '@othrworld/core'
import { getCarthesianCoords } from '@othrworld/orbital-mechanics'
import { styled } from '@othrworld/stitches-config'

import { AtmosphereComponent } from './AtmosphereComponent'
import { OrbitComponent } from './OrbitComponent'
import { SVGCanvasSpawnPortal } from './SVGCanvasSpawnPortal'
import { SVGView, useFixedSizeAdapter, useScaleAdapter } from './SVGView'
import { useCurrentDate } from '../../stores/date'
import { useCanvasTooltipStore } from '../../stores/canvasTooltips'

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

const PlanetRenderComponent: React.FC<{ planet: Planet }> = ({
  planet,
  children,
}) => {
  const fixed = useFixedSizeAdapter()
  const adapter = useScaleAdapter()

  const iconRadius = fixed(5)
  const textFontSize = fixed(10)
  // If the planet's visual radius is above N px, show the name
  const textOpacity = adapter(planet.orbit.a) > fixed(50) ? 1 : 0

  return (
    <>
      <g
        onClick={(e) =>
          useCanvasTooltipStore
            .getState()
            .open(e, { type: 'planet', id: planet.id })
        }
      >
        <PlanetReal r={adapter(planet.radius)} />
        <AtmosphereComponent planet={planet} />
        <PlanetIcon r={iconRadius} />
      </g>
      <PlanetText
        y={Math.max(adapter(planet.radius), iconRadius) + textFontSize}
        fontSize={textFontSize}
        style={{ opacity: textOpacity }}
      >
        {planet.name}
      </PlanetText>
      {children}
    </>
  )
}

interface PlanetComponentProps {
  planet: Planet
}
export const PlanetComponent: React.FC<PlanetComponentProps> = ({
  planet,
  children,
}) => {
  const currentDate = useCurrentDate()
  const adapter = useScaleAdapter()

  const pos = getCarthesianCoords(planet.orbit, currentDate)

  return (
    <OrbitComponent orbit={planet.orbit}>
      <SVGCanvasSpawnPortal>
        <SVGView scale={1e-3} center={{ x: adapter(pos.x), y: adapter(pos.y) }}>
          <PlanetRenderComponent planet={planet}>
            {children}
          </PlanetRenderComponent>
        </SVGView>
      </SVGCanvasSpawnPortal>
      <PlanetRenderComponent planet={planet} />
    </OrbitComponent>
  )
}
