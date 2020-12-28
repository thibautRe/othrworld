import { Orbit } from '@othrworld/core'

export const G = 6.6743e-11

/** Returns the periapsis of a given orbit */
export const getPeriapsis = (orbit: Orbit) => (1 - orbit.e) * orbit.a

/** Returns the apoapsis of a given orbit */
export const getApoapsis = (orbit: Orbit) => (1 + orbit.e) * orbit.a

/** Returns the semi-minor axis of a given orbit */
export const getSemiMinorAxis = (orbit: Orbit) =>
  orbit.a * Math.sqrt(1 - orbit.e ** 2)

/** Returns the current distance for a given orbit */
export const getDistanceForAngle = (orbit: Orbit) =>
  (orbit.a * (1 - orbit.e ** 2)) / (1 + orbit.e * Math.cos(orbit.angle))

/** Returns the angular speed for a circular orbit to complete an orbit */
export const getMeanMotion = (orbit: Orbit, parentMass: number) =>
  Math.sqrt((G * parentMass) / orbit.a ** 3)

/** Returns the period  */
export const getOrbitPeriod = (orbit: Orbit, parentMass: number) =>
  (2 * Math.PI) / getMeanMotion(orbit, parentMass)

const getMeanAnomaly = (
  orbit: Orbit,
  parentMass: number,
  t: number,
  t0: number,
  M0 = 0
) => M0 + getMeanMotion(orbit, parentMass) * (t - t0)

const ε = 1e-4
const maxIter = 20
const getEccentricAnomaly = (
  orbit: Orbit,
  parentMass: number,
  t: number,
  t0: number,
  M0 = 0
) => {
  const { e } = orbit
  const M = getMeanAnomaly(orbit, parentMass, t, t0, M0)
  let E = e < 0.8 ? M : Math.PI

  let dE = 1
  let i = 0
  while (Math.abs(dE) > ε && i < maxIter) {
    dE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E))
    E = E + dE
    i++
  }

  return E
}

export const getTrueAnomaly = (
  orbit: Orbit,
  parentMass: number,
  t: number,
  t0: number,
  M0 = 0
) =>
  2 *
  Math.atan(
    Math.sqrt((1 + orbit.e) / (1 - orbit.e)) *
      Math.tan(getEccentricAnomaly(orbit, parentMass, t, t0, M0) / 2)
  )
