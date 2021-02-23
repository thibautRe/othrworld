import { createID, Planet, Spacecraft, Star, System } from '@othrworld/core'
import { getRandomItemFromArray, randInt, randFloat } from '@othrworld/gen-core'
import { unit } from '@othrworld/units'
import { getBodyMass, getBodySOIRadius } from '@othrworld/body-utils'

import { generatePlanet } from './planet'

export * from './debug'
export * from './solar'

// TODO move some place else (NPM?)
const nonFalsyChecker = <K>(k: K | null | undefined | false): k is K => !!k

export const generateSystem = (): System => {
  // TODO: random star generation
  const star: Star = {
    id: createID(),
    type: 'star',
    name: 'Sun',
    radius: unit(696500000),
    density: unit(0.255 * 5.514e3),
    atmosphere: {
      altitudeHalf: unit(2000000),
      density: unit(1), // fixme
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
        minRadius: 2e6,
        maxRadius: 1e8,
        minDistance: 1e10,
        maxDistance: 1e13,
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
          const soi = getBodySOIRadius(parent)
          const minDistance = parent.radius * 1.1
          const maxDistance = soi * 0.8

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
        .filter(nonFalsyChecker)
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
          dryMass: unit(1000),
          parts: [],
          maneuvers: [],
          orbit: {
            a: unit(parent.radius * randFloat(6, 1.4)),
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
