import { Orbit } from '@othrworld/core'
import { multUnit, Time } from '@othrworld/units'

import { G } from './utils'

/** Returns the periapsis (smallest altitude) of a given orbit */
export const getPeriapsis = (orbit: Orbit) => multUnit(orbit.a, 1 - orbit.e)

/** Returns the apoapsis (highest altitude) of a given orbit */
export const getApoapsis = (orbit: Orbit) => multUnit(orbit.a, 1 + orbit.e)

/** Returns the semi-minor axis of a given orbit */
export const getSemiMinorAxis = (orbit: Orbit) =>
  multUnit(orbit.a, Math.sqrt(1 - orbit.e ** 2))

/** Returns the angular speed for a circular orbit to complete an orbit */
export const getOrbitMeanMotion = (orbit: Orbit) =>
  Math.sqrt((G * orbit.parentMass) / orbit.a ** 3)

/** Returns the period */
export const getOrbitPeriod = (orbit: Orbit): Time =>
  ((2 * Math.PI) / getOrbitMeanMotion(orbit)) as Time
