import {
  Atmosphere,
  Body,
  Spacecraft,
  System,
  createID,
  getBodyMass,
  Planet,
  Star,
} from '@othrworld/core'
import { Density, unit } from '@othrworld/units'

// Density for planets that I don't know yet what they are
// @TODO use the right values from Internet
const dummyDensity: Density = unit(5e3)

// Atmosphere for planets that I don't know yet
const dummyAtm: Atmosphere = {
  density: unit(1),
  altitudeHalf: unit(1),
  composition: {
    argon: 1,
  },
}

/** Generate the Solar System */
export const generateSolarSystem = (): System => {
  const sun: Star = {
    id: createID(),
    type: 'star',
    name: 'Sun',
    radius: unit(696500000),
    density: unit(1.408e3),
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
  const sunMass = getBodyMass(sun)

  const jupiter = createJupiter(sun)
  const earth = createEarth(sun)
  const pluto = createPluto(sun)

  return {
    id: createID(),
    type: 'system',
    spacecrafts: [...earth.spacecrafts, ...jupiter.spacecrafts],
    bodies: [
      sun,
      {
        id: createID(),
        name: 'Mercury',
        type: 'planet',
        radius: unit(2439000),
        density: dummyDensity,
        orbit: {
          a: unit(57909050000),
          e: 0.20563,
          parentId: sun.id,
          parentMass: sunMass,
          phi: 0,
          t0: new Date(),
        },
        atmosphere: dummyAtm,
      },
      {
        id: createID(),
        name: 'Venus',
        type: 'planet',
        radius: unit(6051000),
        density: dummyDensity,
        orbit: {
          a: unit(108200800000),
          e: 0.0067,
          parentId: sun.id,
          parentMass: sunMass,
          phi: 0,
          t0: new Date(),
        },
        atmosphere: dummyAtm,
      },

      ...earth.bodies,

      {
        id: createID(),
        name: 'Mars',
        type: 'planet',
        radius: unit(3389000),
        density: dummyDensity,
        orbit: {
          a: unit(227939200000),
          e: 0.0934,
          parentId: sun.id,
          parentMass: sunMass,
          phi: 0,
          t0: new Date(),
        },
        atmosphere: dummyAtm,
      },

      // ---- ASTEROIDS ---

      ...jupiter.bodies,

      {
        id: createID(),
        name: 'Saturn',
        type: 'planet',
        radius: unit(58232000),
        density: dummyDensity,
        orbit: {
          a: unit(1443000000000),
          e: 0.0565,
          parentId: sun.id,
          parentMass: sunMass,
          phi: 0,
          t0: new Date(),
        },
        atmosphere: dummyAtm,
      },

      {
        id: createID(),
        name: 'Uranus',
        type: 'planet',
        radius: unit(25360000),
        density: dummyDensity,
        orbit: {
          a: unit(2875000000000),
          e: 0.046,
          parentId: sun.id,
          parentMass: sunMass,
          phi: 0,
          t0: new Date(),
        },
        atmosphere: dummyAtm,
      },

      {
        id: createID(),
        name: 'Neptune',
        type: 'planet',
        radius: unit(24620000),
        density: dummyDensity,
        orbit: {
          a: unit(4500000000000),
          e: 0.0086,
          parentId: sun.id,
          parentMass: sunMass,
          phi: 0,
          t0: new Date(),
        },
        atmosphere: dummyAtm,
      },

      ...pluto.bodies,

      // Comets
      {
        id: createID(),
        type: 'planet',
        name: 'Hale–Bopp',
        radius: unit(60000),
        density: dummyDensity,
        orbit: {
          a: unit(27825200000000),
          e: 0.995086,
          parentId: sun.id,
          parentMass: sunMass,
          phi: (130 * Math.PI) / 180,
          t0: new Date('1997-03-30'),
        },
        atmosphere: dummyAtm,
      },
      {
        id: createID(),
        type: 'planet',
        name: 'C/1844 N1 (Mauvais)',
        radius: unit(10000),
        density: dummyDensity,
        orbit: {
          a: unit(526584500000000),
          e: 0.999757,
          parentId: sun.id,
          parentMass: sunMass,
          phi: (211 * Math.PI) / 180,
          t0: new Date('1844-10-17'),
        },
        atmosphere: dummyAtm,
      },
    ],
  }
}

type CP = (sun: Star) => { bodies: Body[]; spacecrafts: Spacecraft[] }

const createEarth: CP = (sun) => {
  const sunMass = getBodyMass(sun)
  const earth: Planet = {
    id: createID(),
    name: 'Earth',
    type: 'planet',
    radius: unit(6371000),
    density: unit(5.514e3),
    orbit: {
      a: unit(149598023000),
      e: 0.0167086,
      parentId: sun.id,
      parentMass: sunMass,
      phi: 0,
      t0: new Date('2021-01-02T13:59'),
    },
    atmosphere: {
      altitudeHalf: unit(5600),
      density: unit(1.2),
      composition: {
        nitrogen: 0.788,
        oxygen: 0.2094,
        argon: 0.0093,
      },
    },
  }
  const parentMass = getBodyMass(earth)
  const moon: Planet = {
    id: createID(),
    name: 'Moon',
    type: 'planet',
    radius: unit(1731000),
    density: dummyDensity,
    orbit: {
      a: unit(384399000),
      e: 0.0549,
      parentId: earth.id,
      parentMass,
      phi: 0,
      t0: new Date(),
    },
    atmosphere: {
      altitudeHalf: unit(100),
      density: unit(6e-15),
      composition: {
        argon: 1,
      },
    },
  }

  return {
    spacecrafts: [
      {
        id: createID(),
        name: 'ISS',
        type: 'spacecraft',
        dryMass: unit(2000000),
        parts: [],
        orbit: {
          a: unit(earth.radius + 450000),
          e: 0,
          parentId: earth.id,
          parentMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Apollo 11',
        type: 'spacecraft',
        dryMass: unit(1000000),
        parts: [],
        orbit: {
          a: unit(moon.radius + 1500000),
          e: 0.2,
          parentId: moon.id,
          parentMass: getBodyMass(moon),
          phi: Math.PI / 4,
          t0: new Date(),
        },
      },
    ],
    bodies: [earth, moon],
  }
}

const createJupiter: CP = (sun) => {
  const sunMass = getBodyMass(sun)
  const jupiter: Planet = {
    id: createID(),
    name: 'Jupiter',
    type: 'planet',
    radius: unit(69911000),
    density: dummyDensity,
    atmosphere: dummyAtm,
    orbit: {
      a: unit(778570000000),
      e: 0.0489,
      parentId: sun.id,
      parentMass: sunMass,
      phi: 0,
      t0: new Date(),
    },
  }

  return {
    spacecrafts: [],
    bodies: [
      jupiter,
      {
        id: createID(),
        name: 'Io',
        type: 'planet',
        radius: unit(3660000 / 2),
        density: dummyDensity,
        atmosphere: dummyAtm,
        orbit: {
          a: unit(421800000),
          e: 0.0041,
          parentId: jupiter.id,
          parentMass: getBodyMass(jupiter),
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Europa',
        type: 'planet',
        radius: unit(3121000 / 2),
        density: dummyDensity,
        atmosphere: dummyAtm,
        orbit: {
          a: unit(671100000),
          e: 0.0094,
          parentId: jupiter.id,
          parentMass: getBodyMass(jupiter),
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Ganymede',
        type: 'planet',
        radius: unit(5268000 / 2),
        density: dummyDensity,
        atmosphere: dummyAtm,
        orbit: {
          a: unit(1070400000),
          e: 0.0011,
          parentId: jupiter.id,
          parentMass: getBodyMass(jupiter),
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Callisto',
        type: 'planet',
        radius: unit(4820000 / 2),
        density: dummyDensity,
        atmosphere: dummyAtm,
        orbit: {
          a: unit(1882700000),
          e: 0.0074,
          parentId: jupiter.id,
          parentMass: getBodyMass(jupiter),
          phi: 0,
          t0: new Date(),
        },
      },
    ],
  }
}

const createPluto: CP = (sun) => {
  const pluto: Planet = {
    id: createID(),
    name: 'Pluto',
    type: 'planet',
    radius: unit(1188000),
    density: dummyDensity,
    orbit: {
      a: unit(5906380000000),
      e: 0.2488,
      parentId: sun.id,
      parentMass: getBodyMass(sun),
      phi: 0,
      t0: new Date('2050-06-01'),
    },
    atmosphere: dummyAtm,
  }
  return {
    spacecrafts: [],
    bodies: [
      pluto,
      {
        id: createID(),
        name: 'Charon',
        type: 'planet',
        radius: unit(606000),
        density: unit(1.702e3),
        orbit: {
          a: unit(19591000),
          e: 0.0002,
          parentId: pluto.id,
          parentMass: getBodyMass(pluto),
          phi: 0,
          t0: new Date('2002-11-22'),
        },
        atmosphere: dummyAtm,
      },
    ],
  }
}
