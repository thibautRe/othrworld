import {
  Spacecraft,
  isSpacecraftEngine,
  SpacecraftFuelContainer,
} from '@othrworld/core'
import { applySpeedChange } from '@othrworld/orbital-mechanics'
import {
  sumUnits,
  getAccelerationFromForceMass,
  getSpeedFromAcceleration,
  getVolumeFromDensity,
  unit,
  Mass,
  Speed,
  Acceleration,
  Time,
} from '@othrworld/units'

import {
  getSpacecraftDryMass,
  getSpacecraftFuelMass,
  getSpacecraftMass,
} from './mass'

const getSpacecraftEngineSpImp = (s: Spacecraft) =>
  sumUnits(...s.parts.filter(isSpacecraftEngine).map((e) => e.specificImpulse))

const getSpacecraftEngineThrust = (s: Spacecraft) =>
  sumUnits(...s.parts.filter(isSpacecraftEngine).map((e) => e.thrust))

const getMaxAcceleration = (s: Spacecraft) =>
  getAccelerationFromForceMass(
    getSpacecraftEngineThrust(s),
    getSpacecraftMass(s)
  )

/** API subject to change: the acceleration vector (absolute?) should be specified here */
export const applyAcceleration = (
  s: Spacecraft,
  requestedAcc: Acceleration,
  t: Date,
  deltaTimeS: Time
): Spacecraft => {
  const maxAcc = getMaxAcceleration(s)

  const effectiveAcc = Math.min(requestedAcc, maxAcc) as Acceleration
  const prograde = getSpeedFromAcceleration(effectiveAcc, deltaTimeS)
  const spImp = getSpacecraftEngineSpImp(s)

  // Tsiolkovsky rocket equation inverted
  const massfuelConsomated: Mass = unit(
    getSpacecraftMass(s) *
      (1 - Math.exp(-Math.abs(prograde) / (spImp * 9.80665)))
  )
  return {
    ...s,
    orbit: applySpeedChange(s.orbit, t, { prograde, normal: 0 }),
    parts: s.parts.map((p) => {
      if (p.type !== 'fuel-container') return p

      // Remove some fuel in the container. How much depends on how many engines are on,
      // how much force they apply, etc... For now we hardcode some values

      const volumeFuelConsomated = getVolumeFromDensity(
        p.fuelDensity,
        massfuelConsomated
      )
      const newFuelContainer: SpacecraftFuelContainer = {
        ...p,
        fuelVolume: unit(p.fuelVolume - volumeFuelConsomated),
      }
      return newFuelContainer
    }),
  }
}

// Tsiolkovsky rocket equation
const G0 = 9.80665
export const getSpacecraftDeltaV = (s: Spacecraft): Speed =>
  (getSpacecraftEngineSpImp(s) *
    G0 *
    Math.log(1 + getSpacecraftFuelMass(s) / getSpacecraftDryMass(s))) as Speed
