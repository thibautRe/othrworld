import { isOrbitHyperbola, Orbit, Planet } from '@othrworld/core'
import { Distance, multUnit } from '@othrworld/units'
import {
  sumVector,
  getApoapsis,
  getCarthesianCoords,
  getNextDateForDistance,
  getPeriapsis,
  getSpeedVector,
  recalculateOrbitForPosAndSpeed,
} from '@othrworld/orbital-mechanics'

import { getBodyMass } from './mass'
import { withMemoSimple } from '@othrworld/memo-utils'

// Memoized base SOI radius for the planet
const getSOIRadiusBaseUnit = withMemoSimple((body: Planet) =>
  Math.pow(getBodyMass(body) / (3 * body.orbit.parentMass), 1 / 3)
)

// https://en.wikipedia.org/wiki/Hill_sphere
const getBodySOIRadiusAtDistance = (body: Planet, r: Distance): Distance =>
  multUnit(r, getSOIRadiusBaseUnit(body))

/** Returns the lowest SOI Radius (at periapsis) */
export const getBodySOIRadius = (body: Planet) =>
  getBodySOIRadiusAtDistance(body, getPeriapsis(body.orbit))

// ---- SOI and elements in orbit ----

/** Returns true if the given orbit around the body is always contained within the SOI */
const isOrbitContainedInSOI = (body: Planet, orbit: Orbit): boolean => {
  if (isOrbitHyperbola(orbit)) return false
  return getApoapsis(orbit) < getBodySOIRadius(body)
}

/** @unstable */
export const getOrbitSOIEscapeDate = (
  body: Planet,
  orbit: Orbit,
  t: Date
): Date | null => {
  if (isOrbitContainedInSOI(body, orbit)) return null
  // Using Lowest Body SOI for now
  return getNextDateForDistance(orbit, getBodySOIRadius(body), t)
}

/**
 * Returns the escape orbit at a given date
 * @unstable
 **/
export const getEscapeOrbit = (
  body: Planet,
  orbit: Orbit,
  escapeDate: Date
): Orbit => {
  const parentSpeed = getSpeedVector(body.orbit, escapeDate)
  const parentCoords = getCarthesianCoords(body.orbit, escapeDate)
  const relativeSpeed = getSpeedVector(orbit, escapeDate)
  const relativeCoords = getCarthesianCoords(orbit, escapeDate)

  return recalculateOrbitForPosAndSpeed(
    body.orbit,
    sumVector(parentCoords, relativeCoords),
    sumVector(parentSpeed, relativeSpeed),
    escapeDate
  )
}
