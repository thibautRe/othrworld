import { Orbit } from '@othrworld/core'
import { Distance, Speed, unit } from '@othrworld/units'

import { getCarthesianCoords } from './position'
import { CarthCoords, unitVector } from './coords'
import { G } from './utils'
import { getSpeedVector } from './speed'

const recalculateOrbitForPosAndSpeed = (
  orbit: Orbit,
  pos: CarthCoords,
  speed: CarthCoords,
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
  const E = Math.acos((1 - r / a) / e) * (EquadrantAdjust ? -1 : 1)
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
