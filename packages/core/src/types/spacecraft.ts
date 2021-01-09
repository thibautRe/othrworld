import { ID } from './id'
import { OrbitalElement } from './orbit'

export interface Spacecraft extends OrbitalElement {
  id: ID<'spacecraft'>
  type: 'spacecraft'
  name: string
  /** @unit kg */
  dryMass: number
  parts: SpacecraftPart[]
}

export interface SpacecraftEngine {
  type: 'engine'
  name: string
  /** @unit TODO: check unit */
  specificImpulse: number
  /** @unit kg */
  mass: number
}

export interface SpacecraftFuelContainer {
  type: 'fuel-container'
  /** @unit m^3 */
  volume: number
  /** @unit kg/m^3 */
  fuelDensity: number
  /** @unit kg */
  dryMass: number
}

export type SpacecraftPart = SpacecraftEngine | SpacecraftFuelContainer
