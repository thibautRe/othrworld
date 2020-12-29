export type ID<TBrand extends string> = string & { __brand: TBrand }

export interface System {
  id: ID<'system'>
  type: 'system'
  planets: Planet[]
}

export interface Orbit {
  /** semi-major axis distance */
  a: number

  /** eccentricity */
  e: number

  /** Epoch when planet is at pericenter */
  t0: Date

  /** Mass of the parent
   * @note This might be better stored somewhere else but is useful for calculations
   */
  parentMass: number

  /** semi-major axis angle from horizontal (radians) */
  phi: number
}
export interface Planet {
  id: ID<'planet'>
  parentId?: ID<'planet'>
  type: 'planet'
  name: string
  radius: number
  orbit: Orbit
}
