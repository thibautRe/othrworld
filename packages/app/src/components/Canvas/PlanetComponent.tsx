import React from 'react'
import { Planet } from '@othrworld/core'
import { useCanvasView } from '../../providers/CanvasViewProvider'

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
  const {
    transform: { k },
  } = useCanvasView()

  const textFontSize = 16 / k
  // If the planet's visual radius is above N px, show the name
  const textOpacity = planet.distance * k > 50 ? 1 : 0

  return (
    <PlanetGroup planet={parent}>
      <PlanetGroup planet={planet}>
        <circle r={planet.radius} cx={0} cy={0} style={{ fill: '#c1beae' }} />
        <text
          textAnchor="middle"
          x={0}
          y={planet.radius + textFontSize}
          fontSize={textFontSize}
          style={{
            fill: 'white',
            opacity: textOpacity,
            transition: 'opacity .2s',
          }}
        >
          {planet.name}
        </text>
      </PlanetGroup>

      <circle
        r={planet.distance}
        cx={0}
        cy={0}
        strokeWidth={2 / k}
        style={{
          fill: 'none',
          stroke: '#c1beae',
          opacity: 0.8,
        }}
      />
    </PlanetGroup>
  )
}
