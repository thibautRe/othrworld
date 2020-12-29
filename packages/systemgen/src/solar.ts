import { createID, System } from '@othrworld/core'

/** Generate the Solar System */
export const generateSolarSystem = (): System => {
  const solMass = 1.98e30 // kg
  const solRadius = 696500 // km
  const earthId = createID<'planet'>()
  const earthMass = 5.972e24
  const jupiterId = createID<'planet'>()
  const jupiterMass = 1.898e27
  return {
    id: createID(),
    type: 'system',
    planets: [
      {
        id: createID(),
        name: 'Mercury',
        type: 'planet',
        radius: 2439,
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
        orbit: {
          a: 108200800,
          e: 0.0067,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: earthId,
        name: 'Earth',
        type: 'planet',
        radius: 6371,
        orbit: {
          a: 149598023,
          e: 0.0167086,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Moon',
        type: 'planet',
        radius: 1731,
        parentId: earthId,
        orbit: {
          a: 384399,
          e: 0.0549,
          parentMass: earthMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Mars',
        type: 'planet',
        radius: 3389,
        orbit: {
          a: 227939200,
          e: 0.0934,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },

      // ---- ASTEROIDS ---

      {
        id: jupiterId,
        name: 'Jupiter',
        type: 'planet',
        radius: 69911,
        orbit: {
          a: 778570000,
          e: 0.0489,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Io',
        type: 'planet',
        radius: 3660 / 2,
        parentId: jupiterId,
        orbit: {
          a: 421800,
          e: 0.0041,
          parentMass: jupiterMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Europa',
        type: 'planet',
        radius: 3121 / 2,
        parentId: jupiterId,
        orbit: {
          a: 671100,
          e: 0.0094,
          parentMass: jupiterMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Ganymede',
        type: 'planet',
        radius: 5268 / 2,
        parentId: jupiterId,
        orbit: {
          a: 1070400,
          e: 0.0011,
          parentMass: jupiterMass,
          phi: 0,
          t0: new Date(),
        },
      },
      {
        id: createID(),
        name: 'Callisto',
        type: 'planet',
        radius: 4820 / 2,
        parentId: jupiterId,
        orbit: {
          a: 1882700,
          e: 0.0074,
          parentMass: jupiterMass,
          phi: 0,
          t0: new Date(),
        },
      },

      {
        id: createID(),
        name: 'Saturn',
        type: 'planet',
        radius: 58232,
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
        orbit: {
          a: 5906380000,
          e: 0.2488,
          parentMass: solMass,
          phi: 0,
          t0: new Date(),
        },
      },
    ],
  }
}
