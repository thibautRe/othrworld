import React from 'react'
import { generateSystem } from '@othrworld/systemgen'
import { SvgRoot } from './components/Canvas/SvgRoot'

export const App = () => {
  const [system, setSystem] = React.useState(() => generateSystem())
  return (
    <SvgRoot>
      {system.planets.map((planet) => (
        <circle
          key={planet.id}
          r={planet.radius}
          cx={planet.distance}
          cy={40}
        />
      ))}
    </SvgRoot>
  )
}
