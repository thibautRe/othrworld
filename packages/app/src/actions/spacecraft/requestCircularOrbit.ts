import { Spacecraft } from '@othrworld/core'
import {
  getApoapsis,
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
} from '@othrworld/orbital-mechanics'
import { applyAcceleration } from '@othrworld/spacecraft-utils'

import { useDateStore } from '../../stores/date'
import { useSystemStore } from '../../stores/system'

/** Optimal (in terms of energy) circular orbit command producer */
export const requestCircularOrbit = (sId: Spacecraft['id'], radius: number) => {
  const { setSpacecraft } = useSystemStore.getState()
  const { registerDateAction, currentDate } = useDateStore.getState()

  // Phase 1: accelerate in order to reach a certain apoapsis defined by the radius
  const runApsisChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const newS = applyAcceleration(s, 10, currentDate, 1)

    if (getApoapsis(newS.orbit) < radius) {
      registerDateAction(new Date(currentDate.getTime() + 1000), runApsisChange)
    } else {
      registerDateAction(
        getNextApoapsisPassage(s.orbit, currentDate),
        runEccentricityChange
      )
    }

    setSpacecraft(sId, newS)
  }

  // Phase 2: accelerate prograde at the apoapsis as long as the eccentricity decreases
  const runEccentricityChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()
    const newS = applyAcceleration(s, 10, currentDate, 1)

    if (s.orbit.e > newS.orbit.e) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runEccentricityChange
      )
    } else {
      return
    }
    setSpacecraft(sId, newS)
  }

  const spacecraft = useSystemStore.getState().getSpacecraft(sId)!
  registerDateAction(
    getNextPeriapsisPassage(spacecraft.orbit, currentDate),
    runApsisChange
  )
}
