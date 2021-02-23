import { Distance, Mass } from '@othrworld/units'

type EccentricityEllipse = number & { __above1?: false }
type EccentricityHyperbola = number & { __above1?: true }

type SemiAxisEllipse = Distance & { __above0?: true }
type SemiAxisHyperbola = Distance & { __above0?: false }

interface OrbitBaseElements {
  /** Epoch when planet is at pericenter */
  t0: Date

  /** Mass of the parent */
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
