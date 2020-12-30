import { createID, getPlanetMass, Planet, System } from '@othrworld/core'

// Density for planets that I don't know yet what they are
// @TODO use the right values from Internet
const dummyDensity = 5e12

/** Generate the Solar System */
export const generateSolarSystem = (): System => {
  const solMass = 1.98e30 // kg
  const solRadius = 696500 // km

  return {
    id: createID(),
    type: 'system',
    planets: [
      {
        id: createID(),
        name: 'Mercury',
        type: 'planet',
        radius: 2439,
        density: dummyDensity,
        orbit: {
          a: 57909050,
          e: 0.20563,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Venus',
        type: 'planet',
        radius: 6051,
        density: dummyDensity,
        orbit: {
          a: 108200800,
          e: 0.0067,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },

      ...createEarth({ solMass }),

      {
        id: createID(),
        name: 'Mars',
        type: 'planet',
        radius: 3389,
        density: dummyDensity,
        orbit: {
          a: 227939200,
          e: 0.0934,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },

      // ---- ASTEROIDS ---

      ...createJupiter({ solMass }),

      {
        id: createID(),
        name: 'Saturn',
        type: 'planet',
        radius: 58232,
        density: dummyDensity,
        orbit: {
          a: 1443000000,
          e: 0.0565,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },

      {
        id: createID(),
        name: 'Uranus',
        type: 'planet',
        radius: 25360,
        density: dummyDensity,
        orbit: {
          a: 2875000000,
          e: 0.046,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },

      {
        id: createID(),
        name: 'Neptune',
        type: 'planet',
        radius: 24620,
        density: dummyDensity,
        orbit: {
          a: 4500000000,
          e: 0.0086,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },

      {
        id: createID(),
        name: 'Pluto',
        type: 'planet',
        radius: 1188,
        density: dummyDensity,
        orbit: {
          a: 5906380000,
          e: 0.2488,
          parentMass: solMass,
          phi: 0,
          t0: new Date('2050-06-01'),
        },
      },

      // Comets
      {
        id: createID(),
        type: 'planet',
        name: 'Hale–Bopp',
        radius: 60,
        density: dummyDensity,
        orbit: {
          a: 27825200000,
          e: 0.995086,
          parentMass: solMass,
          phi: (130 * Math.PI) / 180,
          t0: new Date('1997-03-30'),
        },
      },
      {
        id: createID(),
        type: 'planet',
        name: 'C/1844 N1 (Mauvais)',
        radius: 10,
        density: dummyDensity,
        orbit: {
          a: 526584500000,
          e: 0.999757,
          parentMass: solMass,
          phi: (211 * Math.PI) / 180,
          t0: new Date('1844-10-17'),
        },
      },
    ],
  }
}

interface CPProps {
  solMass: number
}
type CP = (props: CPProps) => Planet[]

const createEarth: CP = ({ solMass }) => {
  const earth: Planet = {
    id: createID(),
    name: 'Earth',
    type: 'planet',
    radius: 6371,
    density: 5.514e12,
    orbit: {
      a: 149598023,
      e: 0.0167086,
      parentMass: solMass,
      phi: 0,
      t0: new Date('2021-01-02T13:59'),
    },
  }
  return [
    earth,
    {
      id: createID(),
      name: 'Moon',
      type: 'planet',
      radius: 1731,
      parentId: earth.id,
      density: dummyDensity,
      orbit: {
        a: 384399,
        e: 0.0549,
        parentMass: getPlanetMass(earth),
        phi: 0,
        t0: new Date(),
      },
    },
  ]
}

const createJupiter: CP = ({ solMass }) => {
  const jupiter: Planet = {
    id: createID(),
    name: 'Jupiter',
    type: 'planet',
    radius: 69911,
    density: dummyDensity,
    orbit: {
      a: 778570000,
      e: 0.0489,
      parentMass: solMass,
      phi: 0,
      t0: new Date(),
    },
  }

  return [
    jupiter,
    {
      id: createID(),
      name: 'Io',
      type: 'planet',
      radius: 3660 / 2,
      parentId: jupiter.id,
      density: dummyDensity,
      orbit: {
        a: 421800,
        e: 0.0041,
        parentMass: getPlanetMass(jupiter),
        phi: 0,
        t0: new Date(),
      },
    },
    {
      id: createID(),
      name: 'Europa',
      type: 'planet',
      radius: 3121 / 2,
      parentId: jupiter.id,
      density: dummyDensity,
      orbit: {
        a: 671100,
        e: 0.0094,
        parentMass: getPlanetMass(jupiter),
        phi: 0,
        t0: new Date(),
      },
    },
    {
      id: createID(),
      name: 'Ganymede',
      type: 'planet',
      radius: 5268 / 2,
      parentId: jupiter.id,
      density: dummyDensity,
      orbit: {
        a: 1070400,
        e: 0.0011,
        parentMass: getPlanetMass(jupiter),
        phi: 0,
        t0: new Date(),
      },
    },
    {
      id: createID(),
      name: 'Callisto',
      type: 'planet',
      radius: 4820 / 2,
      parentId: jupiter.id,
      density: dummyDensity,
      orbit: {
        a: 1882700,
        e: 0.0074,
        parentMass: getPlanetMass(jupiter),
        phi: 0,
        t0: new Date(),
      },
    },
  ]
}