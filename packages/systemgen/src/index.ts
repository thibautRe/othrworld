import { createID, getPlanetMass, Spacecraft, System } from '@othrworld/core'
import { getRandomItemFromArray, randInt, randFloat } from '@othrworld/gen-core'
import { getPlanetSOIRadiusBounds } from '../../orbital-mechanics/dist'

import { generatePlanet } from './planet'

export * from './debug'
export * from './solar'

export const generateSystem = (): System => {
  // Generate planets
  const rootPlanets = new Array(randInt(10))
    .fill(null)
    .map(() =>
      generatePlanet({
        parentMass: 1e33,
        minRadius: 2e3,
        maxRadius: 1e5,
        minDistance: 1e7,
        maxDistance: 1e10,
      })
    )
    .sort((p1, p2) => p1.orbit.a - p2.orbit.a)

  // Generate moons for random planets
  const moons = rootPlanets.length
    ? new Array(randInt(10))
        .fill(null)
        .map(() => {
          const parent = getRandomItemFromArray(rootPlanets)
          const parentMass = getPlanetMass(parent)
          const [minR] = getPlanetSOIRadiusBounds(parent)
          const minDistance = parent.radius * 1.1
          const maxDistance = minR * 0.8

          if (maxDistance < minDistance) return null
          return generatePlanet({
            parentId: parent.id,
            parentMass,
            minRadius: parent.radius / 5000,
            maxRadius: parent.radius / 100,
            minDistance,
            maxDistance,
          })
        })
        .filter(Boolean)
    : []

  const planets = [...rootPlanets, ...moons]
  const spacecrafts: Spacecraft[] = planets.length
    ? new Array(randInt(10)).fill(null).map((_, i) => {
        const parent = getRandomItemFromArray(planets)
        const parentMass = getPlanetMass(parent)
        return {
          id: createID(),
          name: `Spacecraft ${i}`,
          type: 'spacecraft',
          parentId: parent.id,
          orbit: {
            a: parent.radius * randFloat(6, 1.4),
            e: Math.random() * 0.1,
            parentMass,
            phi: 0,
            t0: new Date(),
          },
        }
      })
    : []

  return {
    id: createID(),
    type: 'system',
    spacecrafts,
    planets,
  }
}
