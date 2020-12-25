import React from 'react'
import { Planet } from '@othrworld/core'

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
export const PlanetComponent = ({ planet, parent }: PlanetProps) => (
  <PlanetGroup planet={parent}>
    <PlanetGroup planet={planet}>
      <circle
        r={Math.max(2, planet.radius)}
        cx={0}
        cy={0}
        style={{ fill: '#c1beae' }}
      />
      <text
        textAnchor="middle"
        x={0}
        y={planet.radius + 16}
        style={{ fill: 'white' }}
      >
        {planet.name}
      </text>
    </PlanetGroup>

    <circle
      r={planet.distance}
      cx={0}
      cy={0}
      style={{
        fill: 'none',
        stroke: '#c1beae',
        strokeWidth: '1px',
        opacity: 0.8,
      }}
    />
  </PlanetGroup>
)
