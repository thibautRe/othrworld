import {
  Spacecraft,
  isSpacecraftEngine,
  SpacecraftFuelContainer,
} from '@othrworld/core'
import { applySpeedChange, SpeedCoords } from '@othrworld/orbital-mechanics'
import {
  sumUnits,
  unit,
  Mass,
  Speed,
  Time,
  multUnit,
  avgUnits,
  subUnits,
  massVolumeDensityTriad,
  forceMassAccelerationTriad,
} from '@othrworld/units'

import { getSpacecraftFuelMass, getSpacecraftMass } from './mass'

const getSpacecraftEngineSpImp = (s: Spacecraft) =>
  sumUnits(...s.parts.filter(isSpacecraftEngine).map((e) => e.specificImpulse))

const getSpacecraftEngineThrust = (s: Spacecraft) =>
  sumUnits(...s.parts.filter(isSpacecraftEngine).map((e) => e.thrust))

export const getMaxAcceleration = (s: Spacecraft) =>
  forceMassAccelerationTriad.getRes(
    getSpacecraftEngineThrust(s),
    getSpacecraftMass(s)
  )

const applySpacecraftSpeedChange = (
  s: Spacecraft,
  t: Date,
  speed: SpeedCoords
): Spacecraft => ({ ...s, orbit: applySpeedChange(s.orbit, t, speed) })

const consomateFuel = (
  s: Spacecraft,
  massFuelConsomated: Mass
): Spacecraft => ({
  ...s,
  parts: s.parts.map((p) => {
    if (p.type !== 'fuel-container') return p

    const volumeFuelConsomated = massVolumeDensityTriad.getDown(
      massFuelConsomated,
      p.fuelDensity
    )
    const newFuelContainer: SpacecraftFuelContainer = {
      ...p,
      fuelVolume: subUnits(p.fuelVolume, volumeFuelConsomated),
    }
    return newFuelContainer
  }),
})

/** @warning API subject to change: the deltaV vector should be specified here */
export const applyDeltaV = (
  s: Spacecraft,
  deltaV: Speed,
  t: Date
): Spacecraft =>
  consomateFuel(
    applySpacecraftSpeedChange(s, t, { prograde: deltaV, normal: unit(0) }),
    getMassFuelForDeltaV(s, deltaV)
  )

const G0 = 9.80665
/** Returns the available deltaV for a spacecraft */
export const getSpacecraftTotalDeltaV = (s: Spacecraft) =>
  getDeltaVForMassFuel(s, getSpacecraftFuelMass(s))

const getDeltaVForMassFuel = (
  s: Spacecraft,
  massFuelConsomated: Mass
): Speed => {
  const startMass = getSpacecraftMass(s)
  const endMass = subUnits(startMass, massFuelConsomated)
  // Tsiolkovsky rocket equation
  return unit(getSpacecraftEngineSpImp(s) * G0 * Math.log(startMass / endMass))
}

const getMassFuelForDeltaV = (s: Spacecraft, deltaV: Speed): Mass =>
  // Reversed Tsiolkovsky rocket equation
  multUnit(
    getSpacecraftMass(s),
    1 - Math.exp(-Math.abs(deltaV) / (getSpacecraftEngineSpImp(s) * G0))
  )

/**
 * Returns an approximation of the burn time for a given deltaV
 * @note result is approximated because the weight of the spacecraft decreases as time goes on
 * and should only be used for getting a rough idea
 */
export const getApproxDeltaVBurnTime = (s: Spacecraft, deltaV: Speed): Time => {
  // We are doing an average of the acceleration at the start and at the end of the burn
  // and consider that for the approximation
  const accAtStart = getMaxAcceleration(s)
  const accAtEnd = getMaxAcceleration(
    consomateFuel(s, getMassFuelForDeltaV(s, deltaV))
  )
  const accAvg = avgUnits(accAtStart, accAtEnd)
  return unit(deltaV / accAvg)
}
