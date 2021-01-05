import { Spacecraft } from '@othrworld/core'
import {
  applySpeedChange,
  getApoapsis,
  getCarthesianCoords,
  getNextApoapsisPassage,
  getSpeedVector,
  recalculateOrbitForPosAndSpeed,
} from '@othrworld/orbital-mechanics'
import { useDateStore } from '../../stores/date'
import { useSystemStore } from '../../stores/system'

export const requestCircularOrbit = (sId: Spacecraft['id'], radius: number) => {
  const runOrbitChangePhase1 = () => {
    const systemStore = useSystemStore.getState()
    const { currentDate, registerDateAction } = useDateStore.getState()
    const s = systemStore.system.spacecrafts.find(({ id }) => id === sId)!

    const currentS = getSpeedVector(s.orbit, currentDate)
    const orbit = recalculateOrbitForPosAndSpeed(
      s.orbit,
      getCarthesianCoords(s.orbit, currentDate),
      { x: currentS.x * 1.0005, y: currentS.y * 1.0005 },
      currentDate
    )

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

  const runOrbitChangePhase2 = () => {
    const systemStore = useSystemStore.getState()
    const { currentDate, registerDateAction } = useDateStore.getState()

    const s = systemStore.system.spacecrafts.find(({ id }) => id === sId)!
    const orbit = applySpeedChange(s.orbit, currentDate, {
      prograde: 0.01,
      normal: 0,
    })

    // As long as the eccentricity is decreasing
    if (s.orbit.e > orbit.e) {
      registerDateAction(
        new Date(currentDate.getTime() + 1000),
        runOrbitChangePhase2
      )
    }
    systemStore.setSpacecraft(sId, { ...s, orbit })
  }

  const { currentDate, registerDateAction } = useDateStore.getState()
  registerDateAction(
    new Date(currentDate.getTime() + 1000),
    runOrbitChangePhase1
  )
}
