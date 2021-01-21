import { Orbit } from '@othrworld/core'
import { unit } from '@othrworld/units'

import { CarthCoords, rotateCarth } from './coords'
import { getRadialCoords } from './position'
import { G } from './utils'

const getSpeedAtDistance = (orbit: Orbit, r: number): number =>
  Math.sqrt(G * orbit.parentMass * (2 / r - 1 / orbit.a))

export const getSpeed = (orbit: Orbit, t: Date): number =>
  getSpeedAtDistance(orbit, getRadialCoords(orbit, t).r)

/** Returns a carthesian vector describing the speed item on the orbit */
export const getSpeedVector = (orbit: Orbit, t: Date): CarthCoords => {
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
