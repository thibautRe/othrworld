import { createID, System } from '@othrworld/core'
import { getRandomItemFromArray } from '@othrworld/gen-core'

import { generatePlanet } from './planet'

export * from './debug'

export const generateSystem = (): System => {
  const amtPlanets = Math.floor(Math.random() * 10)
  const amtMoons = Math.floor(Math.random() * 3)

  // Generate planets
  const planets = new Array(amtPlanets)
    .fill(null)
    .map(() =>
      generatePlanet({
        parentMass: 100000,
        maxRadius: 100,
        minDistance: 600,
        maxDistance: 100000,
      })
    )
    .sort((p1, p2) => p1.orbit.a - p2.orbit.a)

  // Generate moons for random planets
  const moons = planets.length
    ? new Array(amtMoons).fill(null).map(() => {
        const parent = getRandomItemFromArray(planets)
        return generatePlanet({
          parentId: parent.id,
          parentMass: parent.radius ** 2,
          minDistance: parent.radius * 2,
          maxDistance: parent.orbit.a / 10,
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
