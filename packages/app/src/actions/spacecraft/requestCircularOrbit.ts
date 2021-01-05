import { Spacecraft } from '@othrworld/core'
import {
  applySpeedChange,
  getApoapsis,
  getNextApoapsisPassage,
} from '@othrworld/orbital-mechanics'
import { useDateStore } from '../../stores/date'
import { useSystemStore } from '../../stores/system'

export const requestCircularOrbit = (sId: Spacecraft['id'], radius: number) => {
  // Phase 1: accelerate in order to reach a certain apoapsis defined by the radius
  const runOrbitChangePhase1 = () => {
    const systemStore = useSystemStore.getState()
    const { currentDate, registerDateAction } = useDateStore.getState()
    const s = systemStore.system.spacecrafts.find(({ id }) => id === sId)!
    const orbit = applySpeedChange(s.orbit, currentDate, {
      prograde: 0.01,
      normal: 0,
    })

    if (getApoapsis(orbit) < radius) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runOrbitChangePhase1
      )
    } else {
      registerDateAction(
        getNextApoapsisPassage(s.orbit, currentDate),
        runOrbitChangePhase2
      )
    }

    systemStore.setSpacecraft(sId, { ...s, orbit })
  }

  // Phase 2: accelerate prograde at the apoapsis as long as the eccentricity decreases
  const runOrbitChangePhase2 = () => {
    const systemStore = useSystemStore.getState()
    const { currentDate, registerDateAction } = useDateStore.getState()

    const s = systemStore.system.spacecrafts.find(({ id }) => id === sId)!
    const orbit = applySpeedChange(s.orbit, currentDate, {
      prograde: 0.01,
      normal: 0,
    })

    if (s.orbit.e > orbit.e) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runOrbitChangePhase2
      )
    }
    systemStore.setSpacecraft(sId, { ...s, orbit })
  }

  runOrbitChangePhase1()
}
