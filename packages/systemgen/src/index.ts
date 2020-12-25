import { createID, System } from '@othrworld/core'
import { getRandomItemFromArray } from '@othrworld/gen-core'

import { generatePlanet } from './planet'

export const generateSystem = (): System => {
  const amtPlanets = Math.floor(Math.random() * 10)
  const amtMoons = Math.floor(Math.random() * 3)

  // Generate planets
  const planets = new Array(amtPlanets)
    .fill(null)
    .map(() =>
      generatePlanet({ maxRadius: 10, minDistance: 60, maxDistance: 1000 })
    )
    .sort((p1, p2) => p1.distance - p2.distance)

  // Generate moons for random planets
  const moons = planets.length
    ? new Array(amtMoons).fill(null).map(() => {
        const parent = getRandomItemFromArray(planets)
        return generatePlanet({
          parentId: parent.id,
          minDistance: parent.radius * 2,
          maxDistance: parent.distance / 10,
          maxRadius: parent.radius / 10,
        })
      })
    : []

  return {
    id: createID(),
    type: 'system',
    planets: [...planets, ...moons],
  }
}
