import React from 'react'
import { Planet } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'
import {
  getSemiMinorAxis,
  getDistanceForAngle,
  getPeriapsis,
  getApoapsis,
} from '@othrworld/orbital-mechanics'
import { useCanvasView } from '../../providers/CanvasViewProvider'

const PlanetReal = styled.circle({
  fill: '$planet',
})
const PlanetText = styled.text({
  fill: 'white',
  textAnchor: 'middle',
  transition: 'opacity 200ms',
})
const PlanetOrbit = styled.ellipse({
  stroke: '$planetorbit',
  opacity: 0.8,
})

/** Translation group for a planet */
const PlanetGroup: React.FC<{ planet?: Planet }> = ({ planet, children }) => {
  if (!planet) return <>{children}</>

  const dist = getDistanceForAngle(planet.orbit)
  return planet ? (
    <g
      transform={`translate(
        ${Math.cos(planet.orbit.angle) * dist}
        ${Math.sin(planet.orbit.angle) * dist}
      )`}
      data-debug-dist={dist}
    >
      {children}
    </g>
  ) : (
    <>{children}</>
  )
}

interface PlanetProps {
  planet: Planet
  parent?: Planet
}
export const PlanetComponent = ({ planet, parent }: PlanetProps) => {
  const { transform } = useCanvasView()
  const { k } = transform

  const textFontSize = 16 / k
  // If the planet's visual radius is above N px, show the name
  const textOpacity = planet.orbit.a * k > 50 ? 1 : 0

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

      <PlanetOrbit
        rx={planet.orbit.a}
        ry={getSemiMinorAxis(planet.orbit)}
        transform={`
          rotate(${(planet.orbit.phi * 360) / (Math.PI * 2)})
          translate(${-planet.orbit.a * planet.orbit.e} 0)
        `}
        strokeWidth={2 / k}
        data-dbg-peri={getPeriapsis(planet.orbit)}
        data-dbg-apoa={getApoapsis(planet.orbit)}
      />
    </PlanetGroup>
  )
}
