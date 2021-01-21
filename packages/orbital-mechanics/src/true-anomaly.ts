import { Orbit } from '@othrworld/core'
import { getOrbitMeanMotion, getOrbitPeriod } from './orbit-characteristics'
import { realModulo } from './utils'

/**
 * Returns the mean anomaly at a given time
 * This function takes care of using the "modulo" operator on the period
 *
 * @performance There is possibly some performance stuff to do here because meanMotion and getOrbit
 * period are heavily linked and don't depend on time
 */
const getMeanAnomaly = (orbit: Orbit, t: Date, M0 = 0) =>
  M0 +
  getOrbitMeanMotion(orbit) *
    realModulo(
      t.getTime() / 1000 - orbit.t0.getTime() / 1000,
      getOrbitPeriod(orbit)
    )

const ε = 1e-4
const maxIter = 11

/** @link https://github.com/benelsen/orb/blob/master/src/position/keplerian.js source of the alg */
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
