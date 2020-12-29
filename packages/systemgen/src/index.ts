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
      generatePlanet({
        parentMass: 100000,
        maxRadius: 10,
        minDistance: 60,
        maxDistance: 1000,
      })
    )
    .sort((p1, p2) => p1.orbit.a - p2.orbit.a)

  // Generate moons for random planets
  const moons = planets.length
    ? new Array(amtMoons).fill(null).map(() => {
        const parent = getRandomItemFromArray(planets)
        return generatePlanet({
          parentId: parent.id,
          parentMass: 100,
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

export const generateDebugSystem = (): System => {
  return {
    id: createID(),
    type: 'system',
    planets: [
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse',
        radius: 2,
        orbit: {
          t0: new Date(),
          parentMass: 100000,
          a: 100,
          e: 0.1,
          phi: 0,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 2',
        radius: 2,
        orbit: {
          t0: new Date(),
          parentMass: 100000,
          a: 100,
          e: 0.5,
          phi: 0,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 2',
        radius: 2,
        orbit: {
          t0: new Date(),
          parentMass: 100000,
          a: 100,
          e: 0.9,
          phi: 0,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet circle',
        radius: 2,
        orbit: {
          t0: new Date(),
          parentMass: 100000,
          a: 100,
          e: 0,
          phi: 0,
        },
      },
    ],
  }
}
