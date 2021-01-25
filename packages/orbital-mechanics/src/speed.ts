import { Orbit } from '@othrworld/core'
import { Distance, Speed, unit } from '@othrworld/units'

import { CarthCoords, rotateCarth } from './coords'
import { getApoapsis, getPeriapsis } from './orbit-characteristics'
import { getRadialCoords } from './position'
import { G } from './utils'

export const getSpeedAtDistance = (
  orbit: Pick<Orbit, 'a' | 'parentMass'>,
  r: Distance
): Speed => unit(Math.sqrt(G * orbit.parentMass * (2 / r - 1 / orbit.a)))

export const getSpeed = (orbit: Orbit, t: Date): Speed =>
  getSpeedAtDistance(orbit, getRadialCoords(orbit, t).r)

export const getSpeedAtPeriapsis = (orbit: Orbit): Speed =>
  getSpeedAtDistance(orbit, getPeriapsis(orbit))
export const getSpeedAtApoapsis = (orbit: Orbit): Speed =>
  getSpeedAtDistance(orbit, getApoapsis(orbit))

/** Returns a carthesian vector describing the speed item on the orbit */
export const getSpeedVector = (orbit: Orbit, t: Date): CarthCoords<'m/s'> => {
  const { angle } = getRadialCoords(orbit, t)
  const p = orbit.a * (1 - orbit.e * orbit.e)

  return rotateCarth(
    {
      x: unit(-Math.sqrt((G * orbit.parentMass) / p) * Math.sin(angle)),
      y: unit(
        Math.sqrt((G * orbit.parentMass) / p) * (orbit.e + Math.cos(angle))
      ),
    },
    orbit.phi
  )
}
