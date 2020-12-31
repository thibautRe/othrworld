import { Atmosphere, createID, System } from '@othrworld/core'

const atmosphere: Atmosphere = {
  altitudeHalf: 1,
  density: 1,
  composition: {
    argon: 1,
  },
}

export const generateDebugSystem = (): System => {
  const phi = Math.PI / 4
  const a = 1e10
  const parentMass = 1e28
  const t0 = new Date()
  const radius = 1e6
  return {
    id: createID(),
    type: 'system',
    spacecrafts: [],
    planets: [
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse',
        radius,
        density: 1e12,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.1,
          phi,
        },
        atmosphere,
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 2',
        radius,
        density: 1e12,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.5,
          phi,
        },
        atmosphere,
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 3',
        radius,
        density: 1e12,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.9,
          phi,
        },
        atmosphere,
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet ellipse 4',
        radius,
        density: 1e12,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0.99,
          phi,
        },
        atmosphere,
      },
      {
        id: createID(),
        type: 'planet',
        name: 'Planet circle',
        radius,
        density: 1e12,
        orbit: {
          t0,
          parentMass,
          a,
          e: 0,
          phi,
        },
        atmosphere,
      },
    ],
  }
}
