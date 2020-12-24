import React from 'react'
import { Planet } from '@othrworld/core'

interface PlanetProps {
  planet: Planet
  parent?: Planet
}
export const PlanetComponent = ({
  planet: { distance, orbitAngle, radius, name },
  parent,
}: PlanetProps) => (
  <>
    <g
      transform={`translate(${Math.sin(orbitAngle) * distance} ${
        Math.cos(orbitAngle) * distance
      })`}
    >
      <circle
        r={Math.max(2, radius)}
        cx={0}
        cy={0}
        style={{ fill: '#c1beae' }}
      />
      <text textAnchor="middle" x={0} y={radius + 16} style={{ fill: 'white' }}>
        {name}
      </text>
    </g>

    <circle
      r={distance}
      cx={parent?.distance ?? 0}
      cy={0}
      style={{
        fill: 'none',
        stroke: '#c1beae',
        strokeWidth: '1px',
        opacity: 0.8,
      }}
    />
  </>
)
