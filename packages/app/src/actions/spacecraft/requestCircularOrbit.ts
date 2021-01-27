import { Spacecraft } from '@othrworld/core'
import {
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
  findSpeedDiffAtPeriapsisForApoapsis,
  findSpeedDiffAtApoapsisForCircular,
} from '@othrworld/orbital-mechanics'
import {
  applyDeltaV,
  getApproxDeltaVBurnTime,
  getMaxAcceleration,
} from '@othrworld/spacecraft-utils'
import {
  Distance,
  getSpeedFromAcceleration,
  Speed,
  subUnits,
  unit,
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
  const periBurnTime = getApproxDeltaVBurnTime(s, requiredPeriSpeed)
  console.log('Peri burn time', periBurnTime)
  console.log('peri deltav', requiredPeriSpeed.toFixed(1))

  // Phase 1: accelerate in order to reach a certain apoapsis defined by the radius
  const runApsisChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const appliedAcc = Math.min(requiredPeriSpeed, getMaxAcceleration(s))
    const deltaV = getSpeedFromAcceleration(unit(appliedAcc), unit(1))
    requiredPeriSpeed = subUnits(requiredPeriSpeed, deltaV)
    const newS = applyDeltaV(s, deltaV, currentDate)

    if (requiredPeriSpeed > 0) {
      registerDateAction(new Date(currentDate.getTime() + 1000), runApsisChange)
    } else {
      const totalPeriBurnTimeMs = currentDate.getTime() - periPassage.getTime()
      console.log(
        'Effective periapsis burn time',
        (totalPeriBurnTimeMs / 1000).toFixed(1)
      )

      requiredApsisSpeed = findSpeedDiffAtApoapsisForCircular(newS.orbit)
      const apsisBurnTime = getApproxDeltaVBurnTime(s, requiredApsisSpeed)
      console.log('Apoapsis burn time', apsisBurnTime)
      registerDateAction(
        getNextApoapsisPassage(newS.orbit, currentDate),
        runEccentricityChange
      )
    }

    setSpacecraft(sId, newS)
  }

  // Phase 2: accelerate prograde at the apoapsis as long as the eccentricity decreases
  const runEccentricityChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const appliedAcc = Math.min(requiredApsisSpeed, getMaxAcceleration(s))
    const deltaV = getSpeedFromAcceleration(unit(appliedAcc), unit(1))
    requiredApsisSpeed = subUnits(requiredApsisSpeed, deltaV)
    const newS = applyDeltaV(s, deltaV, currentDate)

    if (requiredApsisSpeed > 0) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runEccentricityChange
      )
    }
    setSpacecraft(sId, newS)
  }

  registerDateAction(periPassage, runApsisChange)
}
