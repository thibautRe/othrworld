import { Distance, unit } from '@othrworld/units'

import { isOrbitHyperbola, OrbitEllipse } from '../orbit'
import { multVector, unitVector } from '../coords'
import {
  applySpeedChange,
  findSpeedDiffAtApoapsisForCircular,
  findSpeedDiffAtPeriapsisForApoapsis,
} from '../orbit-change'
import { getNextApoapsisPassage, getNextPeriapsisPassage } from '../passage'
import { getSpeedVector } from '../speed'
import { OrbitManeuver } from '../orbit-maneuver'

export const getHohmannTransfer = (
  orbit: OrbitEllipse,
  endRadius: Distance,
  t: Date
): OrbitManeuver[] => {
  const speedPeri = findSpeedDiffAtPeriapsisForApoapsis(orbit, endRadius)
  const epochPeri = getNextPeriapsisPassage(orbit, t)
  const speedVecUnit = unitVector(getSpeedVector(orbit, epochPeri))

  const periManeuver: OrbitManeuver = {
    epoch: epochPeri,
    deltaV: multVector(speedVecUnit, speedPeri),
  }

  const transferOrbit = applySpeedChange(orbit, epochPeri, {
    prograde: speedPeri,
    normal: unit(0),
  })

  if (isOrbitHyperbola(transferOrbit)) {
    console.error('transferOrbit', { ...transferOrbit })
    throw new Error('Transfer orbit is hyperbolic')
  }

  const speedApo = findSpeedDiffAtApoapsisForCircular(transferOrbit)
  const epochApo = getNextApoapsisPassage(transferOrbit, epochPeri)
  const speedApoVecUnit = unitVector(getSpeedVector(transferOrbit, epochApo))
  const apoManeuver: OrbitManeuver = {
    epoch: epochApo,
    deltaV: multVector(speedApoVecUnit, speedApo),
  }

  return [periManeuver, apoManeuver]
}
