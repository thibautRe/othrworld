import { isOrbitElliptical, Orbit } from '@othrworld/core'
import { unit } from '@othrworld/units'
import { getOrbitMeanMotion, getOrbitPeriod } from './orbit-characteristics'
import { EccentricAnomaly, MeanAnomaly, TrueAnomaly } from './types'
import { realModulo } from './utils'

/**
 * Returns the mean anomaly at a given time
 * This function takes care of using the "modulo" operator on the period if the orbit is elliptic
 */
const getMeanAnomaly = (orbit: Orbit, t: Date): MeanAnomaly => {
  const timeMult = (t.getTime() - orbit.t0.getTime()) / 1000

  return unit(
    getOrbitMeanMotion(orbit) *
      (isOrbitElliptical(orbit)
        ? realModulo(timeMult, getOrbitPeriod(orbit))
        : timeMult)
  )
}

/**
 * Returns the earliest Date for a given Mean Anomaly after a given Date
 * The function can return `null` if the given mean anomaly can never be reached again, for instance
 * when the orbit is hyperbolic
 **/
const getNextDateForMean = (
  M: MeanAnomaly,
  orbit: Orbit,
  t: Date
): Date | null => {
  const t0 = orbit.t0.getTime()
  const F = (M * 1000) / getOrbitMeanMotion(orbit)

  if (isOrbitElliptical(orbit)) {
    const P = 1000 * getOrbitPeriod(orbit)

    // Lowest integer that validates t0 + X*P + F > t
    const X = Math.ceil((t.getTime() - t0 - F) / P)
    return new Date(t0 + X * P + F)
  }

  const tentativePassage = new Date(t0 + F)
  return tentativePassage < t ? null : tentativePassage
}

const ε = 1e-4
const maxIter = 20

/**
 * Remember the last Eccentric Anomaly for an orbit, in order to use that
 * as initial value for the algorithm.
 * This helps to keep the number of maxIteration necessary to compute a hyperbolic
 * orbit when it is far away
 */
const memoLastEcc = new WeakMap<Orbit, EccentricAnomaly>()

/**
 * Mean Anomaly to Eccentric Anomaly
 * It implements a quick WeakMap memoization technique in order to reuse the previous
 * result as a starting point for the next iteration
 * This algorithm is a Newton solving method for the M = E - e*sin(E) function
 * @link https://github.com/benelsen/orb/blob/master/src/position/keplerian.js source of the alg
 * @link https://github.com/poliastro/poliastro/blob/8525e2774c74e9db53be25258cbb9d892c721092/src/poliastro/core/angles.py#L262 another way to do it
 *
 */
const MeanToEcc = (M: MeanAnomaly, orbit: Orbit): EccentricAnomaly => {
  const { e } = orbit

  // Find the ideal initial value for the Newton solver
  let E: EccentricAnomaly = unit(M)
  if (memoLastEcc.has(orbit)) {
    E = memoLastEcc.get(orbit)!
  } else if (e > 0.8) {
    E = unit(Math.PI)
  }

  let dE = 1
  let i = 0
  while (Math.abs(dE) > ε && i < maxIter) {
    if (isOrbitElliptical(orbit)) {
      dE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E))
    } else {
      dE = (M + E - e * Math.sinh(E)) / (e * Math.cosh(E) - 1)
    }
    // @ts-expect-error unit conversion
    E += dE
    i++
  }

  if (i >= maxIter) {
    console.warn('Max iterations reached in Kepler equation solving.')
    // Deep copying the orbit and t because of WeakMap memoization techniques
    console.warn({ M, E, dE, i, orbit: { ...orbit } })
  }

  memoLastEcc.set(orbit, E)

  return E
}

/** Eccentric Anomaly to Mean Anomaly */
const EccToMean = (E: EccentricAnomaly, orbit: Orbit): MeanAnomaly => {
  if (isOrbitElliptical(orbit)) {
    return unit(E - orbit.e * Math.sin(E))
  }
  return unit(orbit.e * Math.sinh(E) - E)
}

/** Eccentric Anomaly to True Anomaly */
const EccToTrue = (E: EccentricAnomaly, orbit: Orbit): TrueAnomaly => {
  const e = orbit.e
  if (isOrbitElliptical(orbit)) {
    return unit(2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)))
  }
  return unit(2 * Math.atan(Math.sqrt((1 + e) / (e - 1)) * Math.tanh(E / 2)))
}

/** True anomaly to Eccentric Anomaly */
const TrueToEcc = (nu: TrueAnomaly, orbit: Orbit): EccentricAnomaly => {
  const e = orbit.e
  if (isOrbitElliptical(orbit)) {
    return unit(2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(nu / 2)))
  }
  return unit(2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan(nu / 2)))
}

/** Returns the True Anomaly at a given Date */
export const getTrueAnomaly = (orbit: Orbit, t: Date) => {
  const M = getMeanAnomaly(orbit, t)
  return EccToTrue(MeanToEcc(M, orbit), orbit)
}

/** Returns a Date at which an orbit has a given true anomaly */
export const getNextDateAtTrueAnomaly = (
  nu: TrueAnomaly,
  orbit: Orbit,
  t: Date
): Date | null =>
  getNextDateForMean(EccToMean(TrueToEcc(nu, orbit), orbit), orbit, t)
