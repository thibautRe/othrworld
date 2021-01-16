import { Density, Mass, Time, Volume, Force } from '@othrworld/units'
import { ID } from './id'
import { Orbit } from './orbit'

export interface Spacecraft {
  id: ID<'spacecraft'>
  type: 'spacecraft'
  name: string
  dryMass: Mass
  parts: SpacecraftPart[]
  orbit: Orbit
}

export interface SpacecraftEngine {
  id: ID<'spacecraft-engine'>
  type: 'engine'
  name: string
  mass: Mass
  thrust: Force
  specificImpulse: Time
}
export const isSpacecraftEngine = (
  part: SpacecraftPart
): part is SpacecraftEngine => part.type === 'engine'

export interface SpacecraftFuelContainer {
  id: ID<'spacecraft-fuel-container'>
  type: 'fuel-container'
  volume: Volume
  /** How much fuel is inside the container. Should be between 0 and `volume` */
  fuelVolume: Volume
  fuelDensity: Density
  dryMass: Mass
}
export const isSpacecraftFuelContainer = (
  part: SpacecraftPart
): part is SpacecraftFuelContainer => part.type === 'fuel-container'

export type SpacecraftPart = SpacecraftEngine | SpacecraftFuelContainer
