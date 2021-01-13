import { ID } from './id'
import { Distance, Mass } from './units'

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
