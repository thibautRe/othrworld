import { Distance, Mass, Speed } from '@othrworld/units'
import { ID } from './id'

type EccentricityEllipse = number & { __above1?: false }
type EccentricityHyperbola = number & { __above1?: true }

type SemiAxisEllipse = Distance & { __above0?: true }
type SemiAxisHyperbola = Distance & { __above0?: false }

interface OrbitBaseElements {
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

export interface OrbitEllipse extends OrbitBaseElements {
  /** semi-major axis */
  a: SemiAxisEllipse
  /** eccentricity */
  e: EccentricityEllipse
}

export interface OrbitHyperbola extends OrbitBaseElements {
  /** semi-major axis */
  a: SemiAxisHyperbola
  /** eccentricity */
  e: EccentricityHyperbola
}

export type Orbit = OrbitEllipse | OrbitHyperbola

export const isOrbitElliptical = (orbit: Orbit): orbit is OrbitEllipse =>
  orbit.e < 1
export const isOrbitHyperbola = (orbit: Orbit): orbit is OrbitHyperbola =>
  orbit.e >= 1

export interface OrbitManeuver {
  epoch: Date
  deltaV: { x: Speed; y: Speed }
}
