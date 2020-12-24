import React from 'react'
import { Planet } from '@othrworld/core'

interface PlanetProps {
  planet: Planet
  parent?: Planet
}
export const PlanetComponent = ({ planet, parent }: PlanetProps) => {
  const [angle, setAngle] = React.useState(() => Math.random() * 2 * Math.PI)

  React.useEffect(() => {
    const updateAngle = () => {
      setAngle((a) => a + 100 / planet.distance ** 2)
      af = requestAnimationFrame(updateAngle)
    }
    let af = requestAnimationFrame(updateAngle)
    return () => cancelAnimationFrame(af)
  }, [planet.distance])

  return (
    <>
      {/* Planet dot */}
      <g
        transform={`translate(${Math.sin(angle) * planet.distance} ${
          Math.cos(angle) * planet.distance
        })`}
      >
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
      </g>

      {/* Planet orbit */}
      <circle
        r={planet.distance}
        cx={parent?.distance ?? 0}
        cy={0}
        style={{
          fill: 'none',
          stroke: '#c1beae',
          strokeWidth: '1px',
          opacity: 0.8,
        }}
      />

      {planet.moons.map((moon) => (
        <PlanetComponent key={moon.id} planet={moon} parent={planet} />
      ))}
    </>
  )
}
