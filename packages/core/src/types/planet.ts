import { ID } from './id'
import { Orbit } from './orbit'
import { Distance } from './units'

export interface Planet {
  id: ID<'planet'>
  parentId?: ID<'planet'>
  type: 'planet'
  name: string
  radius: Distance
  orbit: Orbit
  /** @unit kg/km^3 */
  density: number

  atmosphere: Atmosphere
}

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
  oxygen?: number
  nitrogen?: number
}
