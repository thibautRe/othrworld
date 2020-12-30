import { createID, getPlanetMass, System } from '@othrworld/core'
import { getRandomItemFromArray } from '@othrworld/gen-core'

import { generatePlanet } from './planet'

export * from './debug'
export * from './solar'

export const generateSystem = (): System => {
  const amtPlanets = Math.floor(Math.random() * 10)
  const amtMoons = Math.floor(Math.random() * 3)

  // Generate planets
  const planets = new Array(amtPlanets)
    .fill(null)
    .map(() =>
      generatePlanet({
        parentMass: 1e33,
        minRadius: 1e4,
        maxRadius: 1e7,
        minDistance: 1e7,
        maxDistance: 1e10,
      })
    )
    .sort((p1, p2) => p1.orbit.a - p2.orbit.a)

  // Generate moons for random planets
  const moons = planets.length
    ? new Array(amtMoons).fill(null).map(() => {
        const parent = getRandomItemFromArray(planets)
        const parentMass = getPlanetMass(parent)
        return generatePlanet({
          parentId: parent.id,
          parentMass,
          minRadius: parent.radius / 5000,
          maxRadius: parent.radius / 100,
          minDistance: parent.radius * 4,
          maxDistance: parent.orbit.a / 10,
        })
      })
    : []

  return {
    id: createID(),
    type: 'system',
    planets: [...planets, ...moons],
  }
}
