import { Spacecraft } from '@othrworld/core'
import {
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
  findSpeedDiffAtPeriapsisForApoapsis,
  findSpeedDiffAtApoapsisForCircular,
} from '@othrworld/orbital-mechanics'
import {
  applyAcceleration,
  getMaxAcceleration,
} from '@othrworld/spacecraft-utils'
import { Distance, unit } from '@othrworld/units'

import { useDateStore } from '../../stores/date'
import { useSystemStore } from '../../stores/system'

/** Optimal (in terms of energy) circular orbit command producer */
export const requestCircularOrbit = (
  sId: Spacecraft['id'],
  radius: Distance
) => {
  const { setSpacecraft, getSpacecraft } = useSystemStore.getState()
  const { registerDateAction, currentDate } = useDateStore.getState()

  let requiredPeriSpeed = findSpeedDiffAtPeriapsisForApoapsis(
    getSpacecraft(sId)!.orbit,
    radius
  )
  let requiredApsisSpeed = -1

  // Phase 1: accelerate in order to reach a certain apoapsis defined by the radius
  const runApsisChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const appliedAcc = Math.min(requiredPeriSpeed, getMaxAcceleration(s))
    // @ts-expect-error unit issue. This works because the base time is 1 second
    requiredPeriSpeed -= appliedAcc
    const newS = applyAcceleration(s, unit(appliedAcc), currentDate, unit(1))

    if (requiredPeriSpeed > 0) {
      registerDateAction(new Date(currentDate.getTime() + 1000), runApsisChange)
    } else {
      requiredApsisSpeed = findSpeedDiffAtApoapsisForCircular(newS.orbit)
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
    requiredApsisSpeed -= appliedAcc
    const newS = applyAcceleration(s, unit(appliedAcc), currentDate, unit(1))

    if (requiredApsisSpeed > 0) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runEccentricityChange
      )
    }
    setSpacecraft(sId, newS)
  }

  const spacecraft = useSystemStore.getState().getSpacecraft(sId)!
  registerDateAction(
    getNextPeriapsisPassage(spacecraft.orbit, currentDate),
    runApsisChange
  )
}
