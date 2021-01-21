import { Orbit } from '@othrworld/core'
import { multUnit } from '@othrworld/units'

import { CarthCoords, RadialCoords, radialToCarth } from './coords'
import { getTrueAnomaly } from './true-anomaly'

/** Returns the current distance for a given true anomaly */
const getDistanceForTrueAnomaly = (orbit: Orbit, trueAnomaly: number) =>
  multUnit(orbit.a, (1 - orbit.e ** 2) / (1 + orbit.e * Math.cos(trueAnomaly)))

export const getRadialCoords = (orbit: Orbit, t: Date): RadialCoords => {
  const trueAnomaly = getTrueAnomaly(orbit, t)
  const r = getDistanceForTrueAnomaly(orbit, trueAnomaly)
  return { r, angle: trueAnomaly }
}

export const getCarthesianCoords = (orbit: Orbit, t: Date): CarthCoords => {
  const rad = getRadialCoords(orbit, t)
  rad.angle += orbit.phi
  return radialToCarth(rad)
}
