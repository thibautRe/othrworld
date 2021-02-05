import { getBodyMass } from '@othrworld/body-utils'
import { Atmosphere, createID, Planet, Star, System } from '@othrworld/core'
import { unit } from '@othrworld/units'

const atmosphere: Atmosphere = {
  altitudeHalf: unit(1000),
  density: unit(0),
  composition: {
    argon: 1,
  },
}

export const generateDebugSystem = (): System => {
  const star: Star = {
    id: createID(),
    type: 'star',
    name: 'Star',
    radius: unit(69650000),
    density: unit(0.255 * 5.514e3),
    atmosphere: {
      altitudeHalf: unit(2000000),
      density: unit(1),
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
    radius: unit(3300000),
    density: unit(1e4),
    orbit: {
      a: unit(579090500000),
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
        dryMass: unit(10000),
        maneuvers: [],
        parts: [
          {
            id: createID(),
            type: 'engine',
            thrust: unit(2200 * 1e3), // raptor 2200 kN
            specificImpulse: unit(320), // raptor 320s
            mass: unit(1500), // raptor 1500kg
            name: 'Raptor',
          },
          {
            id: createID(),
            type: 'fuel-container',
            dryMass: unit(6000),
            volume: unit(1000),
            fuelVolume: unit(1000),
            fuelDensity: unit(422.8), // liquid methane
          },
        ],
        orbit: {
          a: unit(7000000),
          e: 0.2,
          parentMass: getBodyMass(planet1),
          parentId: planet1.id,
          phi: 0.3,
          t0: new Date('2010-12-01'),
        },
      },
      {
        id: createID(),
        type: 'spacecraft',
        name: 'Spacecraft 2',
        dryMass: unit(10000),
        maneuvers: [],
        parts: [
          {
            id: createID(),
            type: 'engine',
            thrust: unit(2200 * 1e3), // raptor 2200 kN
            specificImpulse: unit(320), // raptor 320s
            mass: unit(1500), // raptor 1500kg
            name: 'Raptor',
          },
          {
            id: createID(),
            type: 'fuel-container',
            dryMass: unit(6000),
            volume: unit(1000),
            fuelVolume: unit(500),
            fuelDensity: unit(422.8), // liquid methane
          },
        ],
        orbit: {
          a: unit(6000000),
          e: 0.4,
          parentMass: getBodyMass(planet1),
          parentId: planet1.id,
          phi: 0.3,
          t0: new Date('2010-12-02'),
        },
      },
    ],
    bodies: [star, planet1],
  }
}
