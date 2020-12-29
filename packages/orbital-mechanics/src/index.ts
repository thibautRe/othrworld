import { Orbit } from '@othrworld/core'

export const G = 6.6743e-11

/** Returns the periapsis of a given orbit */
export const getPeriapsis = (orbit: Orbit) => (1 - orbit.e) * orbit.a

/** Returns the apoapsis of a given orbit */
export const getApoapsis = (orbit: Orbit) => (1 + orbit.e) * orbit.a

/** Returns the semi-minor axis of a given orbit */
export const getSemiMinorAxis = (orbit: Orbit) =>
  orbit.a * Math.sqrt(1 - orbit.e ** 2)

/** Returns the current distance for a given true anomaly */
const getDistanceForTrueAnomaly = (orbit: Orbit, trueAnomaly: number) =>
  (orbit.a * (1 - orbit.e ** 2)) / (1 + orbit.e * Math.cos(trueAnomaly))

/** Returns the angular speed for a circular orbit to complete an orbit */
export const getMeanMotion = (orbit: Orbit) =>
  Math.sqrt((G * orbit.parentMass) / orbit.a ** 3)

/** Returns the period */
export const getOrbitPeriod = (orbit: Orbit) =>
  (2 * Math.PI) / getMeanMotion(orbit)

/**
 * Returns the mean anomaly at a given time
 * This function takes care of using the "modulo" operator on the period
 *
 * @performance There is possibly some performance stuff to do here because meanMotion and getOrbit
 * period are heavily linked and don't depend on time
 */
const getMeanAnomaly = (orbit: Orbit, t: Date, M0 = 0) =>
  M0 +
  getMeanMotion(orbit) *
    ((t.getTime() - orbit.t0.getTime()) % getOrbitPeriod(orbit))

const ε = 1e-4
const maxIter = 10
const getEccentricAnomaly = (orbit: Orbit, t: Date) => {
  const { e } = orbit
  const M = getMeanAnomaly(orbit, t)
  let E = e < 0.8 ? M : Math.PI

  let dE = 1
  let i = 0
  while (Math.abs(dE) > ε && i < maxIter) {
    dE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E))
    E += dE
    i++
  }

  if (i >= maxIter) {
    console.warn('Max iterations reached in Kepler equation solving.')
    console.warn({ M, dE, i, orbit, t })
  }

  return E
}

/** Returns the True Anomaly at a given Date */
export const getTrueAnomaly = (orbit: Orbit, t: Date) =>
  2 *
  Math.atan(
    Math.sqrt((1 + orbit.e) / (1 - orbit.e)) *
      Math.tan(getEccentricAnomaly(orbit, t) / 2)
  )

export const getRadialCoords = (orbit: Orbit, t: Date) => {
  const trueAnomaly = getTrueAnomaly(orbit, t)
  const r = getDistanceForTrueAnomaly(orbit, trueAnomaly)
  return { r, angle: trueAnomaly }
}
