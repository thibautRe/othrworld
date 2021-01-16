import { ID } from './id'
import { Orbit } from './orbit'
import { Distance } from './units'

interface BodyBase {
  id: ID<'body'>
  name: string
  /** @unit kg/m^3 */
  density: number
  radius: Distance
}

export interface Planet extends BodyBase {
  type: 'planet'
  atmosphere: Atmosphere
  orbit: Orbit
}

export interface Asteroid extends BodyBase {
  type: 'asteroid'
  orbit: Orbit
}

export interface Star extends BodyBase {
  type: 'star'
  atmosphere: Atmosphere

  // Possible fields listed below:
  // energy: number
  // luminosity: number
}

export type Body = Planet | Star | Asteroid

export interface Atmosphere {
  /** Density at sea level
   * @unit kg/m^3 */
  density: number

  /** Altitude at which the density dropped by half
   * @unit m */
  altitudeHalf: number

  /** Assuming that the sum of all components equals 1 */
  composition: AtmosphereComposition
}

export interface AtmosphereComposition {
  argon?: number
  hydrogen?: number
  helium?: number
  oxygen?: number
  nitrogen?: number
}
