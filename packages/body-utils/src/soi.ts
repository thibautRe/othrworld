import { isOrbitHyperbola, Orbit, Planet } from '@othrworld/core'
import { Distance, multUnit } from '@othrworld/units'
import {
  getApoapsis,
  getNextDateForDistance,
  getPeriapsis,
  getRadialCoords,
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

/** Radius of the SOI at a given date */
export const getBodySOIRadius = (body: Planet, t: Date): number => {
  const { r } = getRadialCoords(body.orbit, t)
  return getBodySOIRadiusAtDistance(body, r)
}

/** Returns the lowest SOI Radius (at periapsis) */
export const getLowestBodySOIRadius = (body: Planet) =>
  getBodySOIRadiusAtDistance(body, getPeriapsis(body.orbit))

export const getHighestBodySOIRadius = (body: Planet) =>
  getBodySOIRadiusAtDistance(body, getApoapsis(body.orbit))

/** Return the bounds of the SOI sphere (smallest at periapsis, biggest at apoapsis) */
/** TODO move to a body-utils package */
export const getBodySOIRadiusBounds = (body: Planet): [number, number] => [
  getLowestBodySOIRadius(body),
  getHighestBodySOIRadius(body),
]

// ---- SOI and elements in orbit ----

/** Returns true if the given orbit around the body is always contained within the SOI */
const isOrbitContainedInSOI = (body: Planet, orbit: Orbit): boolean => {
  if (isOrbitHyperbola(orbit)) return false
  return getApoapsis(orbit) < getLowestBodySOIRadius(body)
}

const getOrbitSOIEscapeDate = (
  body: Planet,
  orbit: Orbit,
  t: Date
): Date | null => {
  if (isOrbitContainedInSOI(body, orbit)) return null
  // Using Lowest Body SOI for now
  return getNextDateForDistance(orbit, getLowestBodySOIRadius(body), t)
}
