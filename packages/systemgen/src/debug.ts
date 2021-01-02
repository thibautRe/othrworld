import { Atmosphere, createID, Star, System } from '@othrworld/core'

const atmosphere: Atmosphere = {
  altitudeHalf: 1,
  density: 1,
  composition: {
    argon: 1,
  },
}

export const generateDebugSystem = (): System => {
  const phi = Math.PI / 4
  const a = 1e8
  const parentMass = 1e28
  const t0 = new Date()
  const radius = 1e5

  const star: Star = {
    id: createID(),
    type: 'star',
    name: 'Star',
    radius: 696500,
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
  return {
    id: createID(),
    type: 'system',
    spacecrafts: [],
    bodies: [
      {
        id: createID(),
        parentId: star.id,
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
        parentId: star.id,
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
        parentId: star.id,
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
        parentId: star.id,
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
      // {
      //   id: createID(),
      //   parentId: star.id,
      //   type: 'planet',
      //   name: 'Asteroid',
      //   atmosphere: {
      //     altitudeHalf: 0,
      //     density: 0,
      //     composition: {},
      //   },
      //   density: 1,
      //   radius: 50,
      //   orbit: {
      //     a,
      //     e: 1.2,
      //     parentMass,
      //     phi,
      //     t0,
      //   },
      // },
      {
        id: createID(),
        parentId: star.id,
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
