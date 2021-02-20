import { Planet } from '@othrworld/core'
import { Distance, multUnit } from '@othrworld/units'
import {
  getApoapsis,
  getPeriapsis,
  getRadialCoords,
} from '@othrworld/orbital-mechanics'

import { getBodyMass } from './mass'

// https://en.wikipedia.org/wiki/Hill_sphere
const getBodySOIRadiusAtDistance = (body: Planet, r: Distance): Distance =>
  multUnit(r, Math.pow(getBodyMass(body) / (3 * body.orbit.parentMass), 1 / 3))

/** Radius of the SOI at a given date */
export const getBodySOIRadius = (body: Planet, t: Date): number => {
  const { r } = getRadialCoords(body.orbit, t)
  return getBodySOIRadiusAtDistance(body, r)
}

/** Return the bounds of the SOI sphere (smallest at perihelion, biggest at aphelion) */
/** TODO move to a body-utils package */
export const getBodySOIRadiusBounds = (body: Planet): [number, number] => [
  getBodySOIRadiusAtDistance(body, getPeriapsis(body.orbit)),
  getBodySOIRadiusAtDistance(body, getApoapsis(body.orbit)),
]
