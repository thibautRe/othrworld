import {
  Atmosphere,
  createID,
  getBodyMass,
  Planet,
  Star,
  System,
} from '@othrworld/core'

const atmosphere: Atmosphere = {
  altitudeHalf: 1,
  density: 1,
  composition: {
    argon: 1,
  },
}

export const generateDebugSystem = (): System => {
  const star: Star = {
    id: createID(),
    type: 'star',
    name: 'Star',
    radius: 69650,
    density: 0.255 * 5.514e12,
    atmosphere: {
      altitudeHalf: 2000,
      density: 1,
      composition: {
        hydrogen: 73,
        helium: 25,
        oxygen: 1,
      },
    },
  }

  const planet1: Planet = {
    id: createID(),
    name: 'Planet 1',
    type: 'planet',
    radius: 3300,
    density: 1e13,
    orbit: {
      a: 579090500,
      e: 0.20563,
      parentId: star.id,
      parentMass: getBodyMass(star),
      phi: 0,
      t0: new Date(),
    },
    atmosphere,
  }
  return {
    id: createID(),
    type: 'system',
    spacecrafts: [
      {
        id: createID(),
        type: 'spacecraft',
        name: 'Spacecraft',
        dryMass: 10000,
        parts: [
          { type: 'engine', thrust: 2200, mass: 1500, name: 'Raptor' },
          { type: 'engine', thrust: 2200, mass: 1500, name: 'Raptor' },
          {
            type: 'fuel-container',
            dryMass: 6000,
            volume: 10000,
            fuelDensity: 422.8, // liquid methane
          },
        ],
        orbit: {
          a: 7000,
          e: 0.2,
          parentMass: getBodyMass(planet1),
          parentId: planet1.id,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        type: 'spacecraft',
        name: 'Spacecraft 2',
        dryMass: 1000,
        parts: [],
        orbit: {
          a: 12988,
          e: 0.52,
          parentId: planet1.id,
          parentMass: getBodyMass(planet1),
          phi: 1.27,
          t0: new Date(),
        },
      },
    ],
    bodies: [star, planet1],
  }
}
