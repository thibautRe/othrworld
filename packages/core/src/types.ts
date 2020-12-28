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

  /** semi-major axis angle from horizontal (radians) */
  phi: number

  /** Current planet angle as seen from the semi-major axis (radians) */
  angle: number
}
export interface Planet {
  id: ID<'planet'>
  parentId?: ID<'planet'>
  type: 'planet'
  name: string
  radius: number
  orbit: Orbit
}
