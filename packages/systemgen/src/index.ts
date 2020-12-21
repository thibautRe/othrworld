import { createID, System } from '@othrworld/core'

import { generatePlanet } from './planet'

export const generateSystem = (): System => {
  const amtPlanets = Math.floor(Math.random() * 10)

  return {
    id: createID(),
    type: 'system',
    planets: new Array(amtPlanets)
      .fill(null)
      .map(() =>
        generatePlanet({ maxRadius: 10, minDistance: 60, maxDistance: 1000 })
      )
      .sort((p1, p2) => p1.distance - p2.distance),
  }
}
