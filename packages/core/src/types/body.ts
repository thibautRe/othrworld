import { ID } from './id'
import { Orbit } from './orbit'
import { Distance } from './units'

interface BodyBase {
  id: ID<'body'>
  parentId?: ID<'body'>
  name: string
  /** @unit kg/km^3 */
  density: number
  radius: Distance
  orbit: Orbit
}

export interface Planet extends BodyBase {
  type: 'planet'
  atmosphere: Atmosphere
}

export interface Asteroid extends BodyBase {
  type: 'asteroid'
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
   * @unit kg/km^3 */
  density: number

  /** Altitude at which the density dropped by half
   * @unit km */
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
