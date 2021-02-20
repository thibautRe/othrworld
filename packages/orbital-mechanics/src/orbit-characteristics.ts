import { Orbit, OrbitEllipse, OrbitHyperbola } from '@othrworld/core'
import { withMemoSimple } from '@othrworld/memo-utils'
import { multUnit, Speed, Time, unit } from '@othrworld/units'

import { G } from './utils'

/** Returns the periapsis (smallest altitude) of a given orbit */
export const getPeriapsis = (orbit: Orbit) => multUnit(orbit.a, 1 - orbit.e)

/** Returns the apoapsis (highest altitude) of a given orbit. Only available for elliptical orbits */
export const getApoapsis = (orbit: OrbitHyperbola) =>
  multUnit(orbit.a, 1 + orbit.e)

/** Returns the semi-minor axis of a given orbit */
export const getSemiMinorAxis = (orbit: OrbitEllipse) =>
  multUnit(orbit.a, Math.sqrt(1 - orbit.e ** 2))

/** Returns the angular speed for a circular orbit to complete an orbit */
const getOrbitMeanMotionUnmemo = (orbit: Orbit) =>
  Math.sqrt((G * orbit.parentMass) / Math.abs(orbit.a) ** 3)

export const getOrbitMeanMotion = withMemoSimple(getOrbitMeanMotionUnmemo)

/** Returns the period */
const getOrbitPeriodUnmemo = (orbit: OrbitEllipse): Time =>
  ((2 * Math.PI) / getOrbitMeanMotion(orbit)) as Time

export const getOrbitPeriod = withMemoSimple(getOrbitPeriodUnmemo)

/** Returns VInfinity, the residual speed on an hyperbolic orbit */
export const getVInf = (orbit: OrbitHyperbola): Speed =>
  unit(Math.sqrt((-G * orbit.parentMass) / orbit.a))
