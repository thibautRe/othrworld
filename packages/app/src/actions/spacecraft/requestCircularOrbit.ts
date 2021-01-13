import { Spacecraft } from '@othrworld/core'
import {
  applySpeedChange,
  getApoapsis,
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
} from '@othrworld/orbital-mechanics'

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

    const orbit = applySpeedChange(s.orbit, currentDate, {
      prograde: 0.01,
      normal: 0,
    })

    if (getApoapsis(orbit) < radius) {
      registerDateAction(new Date(currentDate.getTime() + 1000), runApsisChange)
    } else {
      registerDateAction(
        getNextApoapsisPassage(s.orbit, currentDate),
        runEccentricityChange
      )
    }

    setSpacecraft(sId, { ...s, orbit })
  }

  // Phase 2: accelerate prograde at the apoapsis as long as the eccentricity decreases
  const runEccentricityChange = () => {
    const s = useSystemStore.getState().getSpacecraft(sId)!
    const { currentDate } = useDateStore.getState()

    const orbit = applySpeedChange(s.orbit, currentDate, {
      prograde: 0.01,
      normal: 0,
    })

    if (s.orbit.e > orbit.e) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runEccentricityChange
      )
    } else {
      return
    }
    setSpacecraft(sId, { ...s, orbit })
  }

  const spacecraft = useSystemStore.getState().getSpacecraft(sId)!
  registerDateAction(
    getNextPeriapsisPassage(spacecraft.orbit, currentDate),
    runApsisChange
  )
}
