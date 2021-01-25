import { Orbit } from '@othrworld/core'
import {
  Distance,
  Speed,
  unit,
  sumUnits,
  subUnits,
  multUnit,
} from '@othrworld/units'

import { getCarthesianCoords } from './position'
import { CarthCoords, unitVector } from './coords'
import { G } from './utils'
import { getSpeedAtDistance, getSpeedVector } from './speed'
import { getApoapsis, getPeriapsis } from './orbit-characteristics'

const recalculateOrbitForPosAndSpeed = (
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

  /**
   * clamp (1 - r / a) / e between -1 and 1 (I have ran into a ECos of -1.0000000000004) which
   * makes Math.acos(ECos) return `NaN`.
   * @test Add a test case for these input values:
   * orbit: {
   *  a: 26701796.135601416,
   *  e: 0.865097802881665,
   *  parentId: "6795324368063.101",
   *  parentMass: 1.5053255358940854e+24,
   *  phi: 0.3311171591510967,
   *  t0: new Date(1611602521370)
   * }
   * pos: {x: -47096233.269638695, y: -16190440.38855717}
   * speed: {x: 173.1969741840608, y: -503.8112006911377}
   * t: new Date(1611645767028)
   */
  const ECos = Math.min(1, Math.max(-1, (1 - r / a) / e))
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

interface SpeedCoords {
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
export const findSpeedDiffAtApoapsisForCircular = (orbit: Orbit): Speed => {
  const apoapsis = getApoapsis(orbit)
  const a = apoapsis
  return subUnits(
    getSpeedAtDistance({ a, parentMass: orbit.parentMass }, apoapsis),
    getSpeedAtDistance(orbit, apoapsis)
  )
}
