import {
  Spacecraft,
  isSpacecraftEngine,
  SpacecraftFuelContainer,
} from '@othrworld/core'
import { applySpeedChange } from '@othrworld/orbital-mechanics'

import {
  getSpacecraftDryMass,
  getSpacecraftFuelMass,
  getSpacecraftMass,
} from './mass'

const getSpacecraftEngineSpImp = (s: Spacecraft) =>
  s.parts
    .filter(isSpacecraftEngine)
    .map((e) => e.specificImpulse)
    .reduce((a, b) => a + b, 0)

const getSpacecraftEngineThrust = (s: Spacecraft) =>
  s.parts
    .filter(isSpacecraftEngine)
    .map((e) => e.thrust)
    .reduce((a, b) => a + b, 0)

/** @unit km/s^2 */
const getMaxAcceleration = (s: Spacecraft) =>
  (getSpacecraftEngineThrust(s) * 1e-3) / getSpacecraftMass(s)

/** API subject to change: the acceleration vector (absolute?) should be specified here */
export const applyAcceleration = (
  s: Spacecraft,
  /** @unit km/s^2 */
  requestedAcc: number,
  t: Date,
  deltaTimeS: number
): Spacecraft => {
  const maxAcc = getMaxAcceleration(s)

  const effectiveAcc = Math.min(requestedAcc, maxAcc)
  const prograde = effectiveAcc * deltaTimeS
  const spImp = getSpacecraftEngineSpImp(s)
  return {
    ...s,
    orbit: applySpeedChange(s.orbit, t, { prograde, normal: 0 }),
    parts: s.parts.map((p) => {
      if (p.type !== 'fuel-container') return p

      // Remove some fuel in the container. How much depends on how many engines are on,
      // how much force they apply, etc... For now we hardcode some values

      // Tsiolkovsky rocket equation
      const massfuelConsomated =
        getSpacecraftMass(s) *
        (1 - Math.exp(-(prograde * 1e3) / (spImp * 9.80665)))
      const volumeFuelConsomated = massfuelConsomated / p.fuelDensity

      const newFuelContainer: SpacecraftFuelContainer = {
        ...p,
        fuelVolume: p.fuelVolume - volumeFuelConsomated,
      }
      return newFuelContainer
    }),
  }
}

// Tsiolkovsky rocket equation
const G0 = 9.80665
export const getSpacecraftDeltaV = (s: Spacecraft) =>
  getSpacecraftEngineSpImp(s) *
  G0 *
  Math.log(1 + getSpacecraftFuelMass(s) / getSpacecraftDryMass(s))
