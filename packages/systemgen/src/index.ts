import {
  createID,
  getBodyMass,
  Spacecraft,
  Star,
  System,
} from '@othrworld/core'
import { getRandomItemFromArray, randInt, randFloat } from '@othrworld/gen-core'
import { getBodySOIRadiusBounds } from '../../orbital-mechanics/dist'

import { generatePlanet } from './planet'

export * from './debug'
export * from './solar'

export const generateSystem = (): System => {
  // TODO: random star generation
  const star: Star = {
    id: createID(),
    type: 'star',
    name: 'Sun',
    radius: 696500,
    density: 0.255 * 5.514e12,
    atmosphere: {
      altitudeHalf: 2000,
      density: 1, // fixme
      composition: {
        hydrogen: 73,
        helium: 25,
        oxygen: 1,
      },
    },
  }

  // Generate planets
  const rootPlanets = new Array(randInt(10))
    .fill(null)
    .map(() =>
      generatePlanet({
        parentId: star.id,
        parentMass: getBodyMass(star),
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
          const parentMass = getBodyMass(parent)
          const [minR] = getBodySOIRadiusBounds(parent)
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

  const bodies = [...rootPlanets, ...moons]
  const spacecrafts: Spacecraft[] = bodies.length
    ? new Array(randInt(10)).fill(null).map((_, i) => {
        const parent = getRandomItemFromArray(bodies)
        const parentMass = getBodyMass(parent)
        return {
          id: createID(),
          name: `Spacecraft ${i}`,
          type: 'spacecraft',
          dryMass: 1000,
          parts: [],
          orbit: {
            a: parent.radius * randFloat(6, 1.4),
            e: Math.random() * 0.1,
            parentId: parent.id,
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
    bodies: [star, ...bodies],
  }
}
