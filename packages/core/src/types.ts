export type ID<TBrand extends string> = string & { __brand: TBrand }

export interface System {
  id: ID<'system'>
  type: 'system'
  planets: Planet[]
  spacecrafts: Spacecraft[]
}

/** @unit km */
type Distance = number

/** @unit kg */
type Mass = number

export interface Orbit {
  /** semi-major axis distance */
  a: Distance

  /** eccentricity */
  e: number

  /** Epoch when planet is at pericenter */
  t0: Date

  /** Mass of the parent
   * @note This might be better stored somewhere else but is useful for calculations
   */
  parentMass: Mass

  /** semi-major axis angle from horizontal (radians) */
  phi: number
}

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

export interface Spacecraft {
  id: ID<'spacecraft'>
  parentId: ID<'planet'>
  type: 'spacecraft'
  name: string
  orbit: Orbit
}
