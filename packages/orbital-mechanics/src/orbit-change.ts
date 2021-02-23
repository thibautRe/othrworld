import { Orbit, OrbitEllipse } from '@othrworld/core'
import {
  Distance,
  Speed,
  unit,
  sumUnits,
  subUnits,
  multUnit,
} from '@othrworld/units'

import { getCarthesianCoords } from './position'
import { CarthCoords, sumVector, unitVector } from './coords'
import { acosClamp, G } from './utils'
import { getSpeedAtDistance, getSpeedVector } from './speed'
import { getApoapsis, getPeriapsis } from './orbit-characteristics'

export const recalculateOrbitForPosAndSpeed = (
  orbit: Orbit,
  pos: CarthCoords<'m'>,
  speed: CarthCoords<'m/s'>,
  t: Date
): Orbit => {
  const mu = G * orbit.parentMass
  const r = Math.hypot(pos.x, pos.y)
  const a: Distance = unit(
    (mu * r) / (2 * mu - r * (speed.x ** 2 + speed.y ** 2))
  )

  const h = pos.x * speed.y - pos.y * speed.x
  const ex = pos.x / r - (h * speed.y) / mu
  const ey = pos.y / r + (h * speed.x) / mu
  const e = Math.hypot(ex, ey)

  const PhiQuadrantAdjust = ex > 0
  const phi = Math.atan(ey / ex) + (PhiQuadrantAdjust ? Math.PI : 0)

  const EquadrantAdjust = -ey * pos.x + ex * pos.y > 0

  // clamp (1 - r / a) / e between -1 and 1 (I have ran into a ECos of -1.0000000000004) which
  // makes Math.acos(ECos) return `NaN`.
  const ECos = acosClamp((1 - r / a) / e)
  const E = Math.acos(ECos) * (EquadrantAdjust ? -1 : 1)
  const tDelta = Math.sqrt(Math.pow(a, 3) / mu) * (E - e * Math.sin(E))
  const t0 = new Date(t.getTime() - tDelta * 1000)

  return {
    ...orbit,
    a,
    e,
    phi,
    t0,
  }
}

export interface SpeedCoords {
  /** Positive for prograde, negative for retrograde */
  prograde: Speed
  /** Positive for outside, negative for inside */
  normal: Speed
}
export const applySpeedChange = (
  orbit: Orbit,
  t: Date,
  { prograde, normal }: SpeedCoords
): Orbit => {
  const currentS = getSpeedVector(orbit, t)
  const currentP = getCarthesianCoords(orbit, t)

  const unitS = unitVector(currentS)

  return recalculateOrbitForPosAndSpeed(
    orbit,
    currentP,
    {
      x: unit(currentS.x + unitS.x * prograde - unitS.y * normal),
      y: unit(currentS.y + unitS.y * prograde + unitS.x * normal),
    },
    t
  )
}

/** Returns the required speed diff for a current orbit at periapsis to reach the target apoapsis */
export const findSpeedDiffAtPeriapsisForApoapsis = (
  orbit: Orbit,
  apoapsis: Distance
): Speed => {
  const periapsis = getPeriapsis(orbit)
  const a = multUnit(sumUnits(apoapsis, periapsis), 0.5)

  return subUnits(
    getSpeedAtDistance({ a, parentMass: orbit.parentMass }, periapsis),
    getSpeedAtDistance(orbit, periapsis)
  )
}

/** Returns the required speed diff for circularizing at apoapsis */
export const findSpeedDiffAtApoapsisForCircular = (
  orbit: OrbitEllipse
): Speed => {
  const apoapsis = getApoapsis(orbit)
  const a = apoapsis
  return subUnits(
    getSpeedAtDistance({ a, parentMass: orbit.parentMass }, apoapsis),
    getSpeedAtDistance(orbit, apoapsis)
  )
}

/**
 * Return the escaped orbit given a parent and an escaping one.
 * The resulting escapedOrbit will be owned by the same Body as the parentOrbit
 **/
export const getEscapedOrbit = (
  parentOrbit: Orbit,
  escapingOrbit: Orbit,
  escapeDate: Date
): Orbit => {
  const parentSpeed = getSpeedVector(parentOrbit, escapeDate)
  const parentCoords = getCarthesianCoords(parentOrbit, escapeDate)
  const relativeSpeed = getSpeedVector(escapingOrbit, escapeDate)
  const relativeCoords = getCarthesianCoords(escapingOrbit, escapeDate)

  return recalculateOrbitForPosAndSpeed(
    parentOrbit,
    sumVector(parentCoords, relativeCoords),
    sumVector(parentSpeed, relativeSpeed),
    escapeDate
  )
}
