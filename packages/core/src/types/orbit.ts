import { Distance, Mass, Speed } from '@othrworld/units'
import { ID } from './id'

export interface Orbit {
  /** semi-major axis distance */
  a: Distance

  /** eccentricity */
  e: number

  /** Epoch when planet is at pericenter */
  t0: Date

  /** ID of the parent body */
  parentId: ID<'body'>

  /** Mass of the parent
   * @note This might be better stored somewhere else but is useful for calculations
   */
  parentMass: Mass

  /** semi-major axis angle from horizontal (radians) */
  phi: number
}

export interface OrbitManeuver {
  epoch: Date
  deltaV: { x: Speed; y: Speed }
}
