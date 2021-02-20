import { Orbit } from '@othrworld/core'
import { withMemoDouble } from '@othrworld/memo-utils'
import { Distance, multUnit, unit } from '@othrworld/units'

import { CarthCoords, RadialCoords, radialToCarth } from './coords'
import { getTrueAnomaly } from './true-anomaly'

/** Returns the distance for a given true anomaly */
const getDistanceForTrueAnomaly = ({ a, e }: Orbit, trueAnomaly: number) =>
  multUnit(a, (1 - e ** 2) / (1 + e * Math.cos(trueAnomaly)))

/**
 * Returns the true anomaly for a given distance
 * @note Due to the symetry of the solutions, the negative value of the returned
 * function could also be usable.
 **/
const getTrueAnomalyForDistance = ({ a, e }: Orbit, r: Distance) =>
  Math.acos(((a * (1 - e ** 2)) / r - 1) / e)

export const getRadialCoords = withMemoDouble(
  (orbit: Orbit, t: Date): RadialCoords<'m'> => {
    const trueAnomaly = getTrueAnomaly(orbit, t)
    const r = getDistanceForTrueAnomaly(orbit, trueAnomaly)
    return { r, angle: trueAnomaly }
  }
)

export const getCarthesianCoords = withMemoDouble(
  (orbit: Orbit, t: Date): CarthCoords<'m'> => {
    const rad = getRadialCoords(orbit, t)
    rad.angle += orbit.phi
    return radialToCarth(rad)
  }
)
