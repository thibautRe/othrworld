import React from 'react'
import { Planet } from '@othrworld/core'
import { useCanvasView } from '../../providers/CanvasViewProvider'
import { styled } from '@othrworld/stitches-config'

const PlanetReal = styled.circle({
  fill: '$planet',
})
const PlanetText = styled.text({
  fill: 'white',
  textAnchor: 'middle',
  transition: 'opacity 200ms',
})
const PlanetOrbit = styled.circle({
  stroke: '$planetorbit',
  opacity: 0.8,
})

/** Translation group for a planet */
const PlanetGroup: React.FC<{ planet?: Planet }> = ({ planet, children }) =>
  planet ? (
    <g
      transform={`translate(
        ${Math.sin(planet.orbitAngle) * planet.distance}
        ${Math.cos(planet.orbitAngle) * planet.distance}
      )`}
    >
      {children}
    </g>
  ) : (
    <>{children}</>
  )

interface PlanetProps {
  planet: Planet
  parent?: Planet
}
export const PlanetComponent = ({ planet, parent }: PlanetProps) => {
  const { transform } = useCanvasView()
  const { k } = transform

  const textFontSize = 16 / k
  // If the planet's visual radius is above N px, show the name
  const textOpacity = planet.distance * k > 50 ? 1 : 0

  return (
    <PlanetGroup planet={parent}>
      <PlanetGroup planet={planet}>
        <PlanetReal r={planet.radius} />
        <PlanetText
          y={planet.radius + textFontSize}
          fontSize={textFontSize}
          style={{ opacity: textOpacity }}
        >
          {planet.name}
        </PlanetText>
      </PlanetGroup>

      <PlanetOrbit r={planet.distance} strokeWidth={2 / k} />
    </PlanetGroup>
  )
}
