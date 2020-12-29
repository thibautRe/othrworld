import { createID, System } from '@othrworld/core'

export const generateDebugSystem = (): System => {
  const phi = Math.PI / 4
  const a = 100
  const parentMass = 100000
  const t0 = new Date()
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
          t0,
          parentMass,
          a,
          e: 0.1,
          phi,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 2',
        radius: 2,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.5,
          phi,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 3',
        radius: 2,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.9,
          phi,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 4',
        radius: 2,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.99,
          phi,
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet circle',
        radius: 2,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0,
          phi,
        },
      },
    ],
  }
}
