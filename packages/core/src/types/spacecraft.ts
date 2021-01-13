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
  type: 'engine'
  name: string
  /** @unit kg */
  mass: number
  /** @unit Newton */
  thrust: number
}
export const isSpacecraftEngine = (
  part: SpacecraftPart
): part is SpacecraftEngine => part.type === 'engine'

export interface SpacecraftFuelContainer {
  type: 'fuel-container'
  /** @unit m^3 */
  volume: number
  /** @unit kg/m^3 */
  fuelDensity: number
  /** @unit kg */
  dryMass: number
}
export const isSpacecraftFuelContainer = (
  part: SpacecraftPart
): part is SpacecraftFuelContainer => part.type === 'fuel-container'

export type SpacecraftPart = SpacecraftEngine | SpacecraftFuelContainer
