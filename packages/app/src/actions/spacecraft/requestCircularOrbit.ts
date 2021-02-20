import { Spacecraft } from '@othrworld/core'
import {
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
  findSpeedDiffAtPeriapsisForApoapsis,
  findSpeedDiffAtApoapsisForCircular,
  getHohmannTransfer,
} from '@othrworld/orbital-mechanics'
import { applyDeltaV, getMaxAcceleration } from '@othrworld/spacecraft-utils'
import {
  Distance,
  Speed,
  subUnits,
  unit,
  Acceleration,
  speedTimeAccelerationTriad,
} from '@othrworld/units'

import { useDateStore } from '../../stores/date'
import { useSystemStore } from '../../stores/system'

/** Optimal (in terms of energy) circular orbit command producer */
export const requestCircularOrbit = (
  sId: Spacecraft['id'],
  radius: Distance
) => {
  const { setSpacecraft, getSpacecraft } = useSystemStore.getState()
  const { registerDateAction, currentDate } = useDateStore.getState()
  const s = getSpacecraft(sId)!

  let requiredPeriSpeed = findSpeedDiffAtPeriapsisForApoapsis(s.orbit, radius)
  let requiredApsisSpeed: Speed

  const periPassage = getNextPeriapsisPassage(s.orbit, currentDate)

  // Phase 1: accelerate in order to reach a certain apoapsis defined by the radius
  const runApsisChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const appliedAcc: Acceleration = unit(
      Math.min(requiredPeriSpeed, getMaxAcceleration(s))
    )
    const deltaV = speedTimeAccelerationTriad.getUp(unit(1), appliedAcc)
    requiredPeriSpeed = subUnits(requiredPeriSpeed, deltaV)
    const newS = applyDeltaV(s, deltaV, currentDate)

    if (requiredPeriSpeed > 0) {
      registerDateAction(new Date(currentDate.getTime() + 1000), runApsisChange)
    } else {
      requiredApsisSpeed = findSpeedDiffAtApoapsisForCircular(newS.orbit)
      registerDateAction(
        getNextApoapsisPassage(newS.orbit, currentDate),
        runEccentricityChange
      )
    }

    setSpacecraft(sId, () => newS)
  }

  // Phase 2: accelerate prograde at the apoapsis as long as the eccentricity decreases
  const runEccentricityChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const appliedAcc: Acceleration = unit(
      Math.min(requiredApsisSpeed, getMaxAcceleration(s))
    )
    const deltaV = speedTimeAccelerationTriad.getUp(unit(1), appliedAcc)
    requiredApsisSpeed = subUnits(requiredApsisSpeed, deltaV)
    const newS = applyDeltaV(s, deltaV, currentDate)

    if (requiredApsisSpeed > 0) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runEccentricityChange
      )
    }
    setSpacecraft(sId, () => newS)
  }

  registerDateAction(periPassage, runApsisChange)
}

export const requestHohmannManeuvers = (
  sId: Spacecraft['id'],
  radius: Distance
) => {
  const { getSpacecraft, setSpacecraftManeuvers } = useSystemStore.getState()
  const { currentDate } = useDateStore.getState()
  const spacecraft = getSpacecraft(sId)
  if (!spacecraft) return
  const maneuvers = getHohmannTransfer(spacecraft.orbit, radius, currentDate)
  setSpacecraftManeuvers(sId, maneuvers)
}
