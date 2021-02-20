import { Orbit, OrbitEllipse, OrbitHyperbola } from '@othrworld/core'
import { withMemoSimple } from '@othrworld/memo-utils'
import { multUnit, Speed, Time, unit } from '@othrworld/units'

import { G } from './utils'

/** Returns the periapsis (smallest altitude) of a given orbit */
export const getPeriapsis = (orbit: Orbit) => multUnit(orbit.a, 1 - orbit.e)

/** Returns the apoapsis (highest altitude) of a given orbit. Only available for elliptical orbits */
export const getApoapsis = (orbit: OrbitEllipse) =>
  multUnit(orbit.a, 1 + orbit.e)

/** Returns the semi-minor axis of a given orbit */
export const getSemiMinorAxis = withMemoSimple((orbit: OrbitEllipse) =>
  multUnit(orbit.a, Math.sqrt(1 - orbit.e ** 2))
)

/** Returns the angular speed for a circular orbit to complete an orbit */
export const getOrbitMeanMotion = withMemoSimple((orbit: Orbit) =>
  Math.sqrt((G * orbit.parentMass) / Math.abs(orbit.a) ** 3)
)

/** Returns the period */
export const getOrbitPeriod = withMemoSimple(
  (orbit: OrbitEllipse): Time =>
    ((2 * Math.PI) / getOrbitMeanMotion(orbit)) as Time
)

/** Returns VInfinity, the residual speed on an hyperbolic orbit */
export const getVInf = withMemoSimple(
  (orbit: OrbitHyperbola): Speed =>
    unit(Math.sqrt((-G * orbit.parentMass) / orbit.a))
)
