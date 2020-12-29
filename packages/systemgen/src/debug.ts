import { createID, System } from '@othrworld/core'

export const generateDebugSystem = (): System => {
  const phi = Math.PI / 4
  const a = 1e10
  const parentMass = 1e28
  const t0 = new Date()
  const radius = 1e6
  return {
    id: createID(),
    type: 'system',
    planets: [
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse',
        radius,
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
        radius,
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
        radius,
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
        radius,
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
        radius,
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
