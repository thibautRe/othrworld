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
    orbit: {
      a: 0,
      e: 0,
      parentMass: 1,
      phi: 0,
      t0: new Date(),
    },
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
    parentId: star.id,
    name: 'Planet 1',
    type: 'planet',
    radius: 3300,
    density: 1e13,
    orbit: {
      a: 579090500,
      e: 0.20563,
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
      // {
      //   id: createID(),
      //   type: 'spacecraft',
      //   name: 'Spacecraft',
      //   parentId: planet1.id,
      //   dryMass: 1000,
      //   parts: [],
      //   orbit: {
      //     a: 7000,
      //     e: 0.2,
      //     parentMass: getBodyMass(planet1),
      //     phi: 0,
      //     t0: new Date(),
      //   },
      // },
      {
        id: createID(),
        type: 'spacecraft',
        name: 'Spacecraft 2',
        parentId: planet1.id,
        dryMass: 1000,
        parts: [],
        orbit: {
          a: 12988,
          e: 0.52,
          parentMass: getBodyMass(planet1),
          phi: 1.27,
          t0: new Date(),
        },
      },
    ],
    bodies: [star, planet1],
  }
}
