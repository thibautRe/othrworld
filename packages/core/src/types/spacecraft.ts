import { Body } from './body'
import { ID } from './id'
import { Orbit } from './orbit'

export interface Spacecraft {
  id: ID<'spacecraft'>
  parentId: Body['id']
  type: 'spacecraft'
  name: string
  /** @unit kg */
  dryMass: number
  orbit: Orbit
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
