import { isOrbitElliptical, Orbit } from '@othrworld/core'
import { getOrbitMeanMotion, getOrbitPeriod } from './orbit-characteristics'
import { realModulo } from './utils'

/**
 * Returns the mean anomaly at a given time
 * This function takes care of using the "modulo" operator on the period if the orbit is elliptic
 */
const getMeanAnomaly = (orbit: Orbit, t: Date, M0 = 0) => {
  const timeMult = t.getTime() / 1000 - orbit.t0.getTime() / 1000

  return (
    M0 +
    getOrbitMeanMotion(orbit) *
      (isOrbitElliptical(orbit)
        ? realModulo(timeMult, getOrbitPeriod(orbit))
        : timeMult)
  )
}

const ε = 1e-4
const maxIter = 20

/**
 * Remember the last Eccentric Anomaly for an orbit, in order to use that
 * as initial value for the algorithm.
 * This helps to keep the number of maxIteration necessary to compute a hyperbolic
 * orbit when it is far away
 */
const memoLastEccentricAnomaly = new WeakMap<Orbit, number>()

/** @link https://github.com/benelsen/orb/blob/master/src/position/keplerian.js source of the alg */
const getEccentricAnomaly = (orbit: Orbit, t: Date) => {
  const { e } = orbit
  const M = getMeanAnomaly(orbit, t)
  let E = M

  if (memoLastEccentricAnomaly.has(orbit)) {
    E = memoLastEccentricAnomaly.get(orbit)!
  } else if (e > 0.8) {
    E = Math.PI
  }

  // if (e > 1 && t > orbit.t0) {
  //   E = Math.acos(-1 / e)
  // }

  let dE = 1
  let i = 0
  while (Math.abs(dE) > ε && i < maxIter) {
    if (orbit.e < 1) {
      dE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E))
    } else if (orbit.e > 1) {
      dE = (M + E - e * Math.sinh(E)) / (e * Math.cosh(E) - 1)
    }
    E += dE
    i++
  }

  if (i >= maxIter) {
    console.warn('Max iterations reached in Kepler equation solving.')
    // Deep copying the orbit and t because of WeakMap memoization techniques
    console.warn({ M, E, dE, i, orbit: { ...orbit }, t: new Date(t.getTime()) })
  }

  memoLastEccentricAnomaly.set(orbit, E)

  return E
}

/** Returns the True Anomaly at a given Date */
export const getTrueAnomaly = (orbit: Orbit, t: Date) => {
  const E = getEccentricAnomaly(orbit, t)
  if (orbit.e < 1) {
    return (
      2 * Math.atan(Math.sqrt((1 + orbit.e) / (1 - orbit.e)) * Math.tan(E / 2))
    )
  } else if (orbit.e > 1) {
    return (
      2 * Math.atan(Math.sqrt((1 + orbit.e) / (orbit.e - 1)) * Math.tanh(E / 2))
    )
  }

  throw new Error('Cannot find true anomaly for parabolic orbit')
}
