import { Orbit, OrbitManeuver } from '@othrworld/core'
import { Distance, unit } from '@othrworld/units'
import { multVector, unitVector } from '../coords'
import {
  applySpeedChange,
  findSpeedDiffAtApoapsisForCircular,
  findSpeedDiffAtPeriapsisForApoapsis,
} from '../orbit-change'
import { getNextApoapsisPassage, getNextPeriapsisPassage } from '../passage'
import { getSpeedVector } from '../speed'

export const getHohmannTransfer = (
  orbit: Orbit,
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
  const speedApo = findSpeedDiffAtApoapsisForCircular(transferOrbit)
  const epochApo = getNextApoapsisPassage(transferOrbit, epochPeri)
  const speedApoVecUnit = unitVector(getSpeedVector(transferOrbit, epochApo))
  const apoManeuver: OrbitManeuver = {
    epoch: epochApo,
    deltaV: multVector(speedApoVecUnit, speedApo),
  }

  return [periManeuver, apoManeuver]
}
