import { ID } from './id'
import { Orbit } from './orbit'

export interface Spacecraft {
  id: ID<'spacecraft'>
  type: 'spacecraft'
  name: string
  /** @unit kg */
  dryMass: number
  parts: SpacecraftPart[]
  orbit: Orbit
}

export interface SpacecraftEngine {
  id: ID<'spacecraft-engine'>
  type: 'engine'
  name: string
  /** @unit kg */
  mass: number
  /** @unit Newton */
  thrust: number
  /** @unit seconds */
  specificImpulse: number
}
export const isSpacecraftEngine = (
  part: SpacecraftPart
): part is SpacecraftEngine => part.type === 'engine'

export interface SpacecraftFuelContainer {
  id: ID<'spacecraft-fuel-container'>
  type: 'fuel-container'
  /** @unit m^3 */
  volume: number
  /** How much fuel is inside the container. Should be between 0 and `volume`
   * @unit m^3 */
  fuelVolume: number
  /** @unit kg/m^3 */
  fuelDensity: number
  /** @unit kg */
  dryMass: number
}
export const isSpacecraftFuelContainer = (
  part: SpacecraftPart
): part is SpacecraftFuelContainer => part.type === 'fuel-container'

export type SpacecraftPart = SpacecraftEngine | SpacecraftFuelContainer
