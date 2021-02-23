import { Density, Distance } from '@othrworld/units'
import { OrbitEllipse } from '@othrworld/orbit'

import { ID } from './id'
import { SystemOrbit } from './systemOrbit'

interface BodyBase {
  id: ID<'body'>
  name: string
  density: Density
  radius: Distance
}

export interface Planet extends BodyBase {
  type: 'planet'
  atmosphere: Atmosphere
  orbit: SystemOrbit<OrbitEllipse>
}

export interface Asteroid extends BodyBase {
  type: 'asteroid'
  orbit: SystemOrbit
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
  density: Density

  /** Altitude at which the density dropped by half
   * @unit m */
  altitudeHalf: Distance

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
