import { CarthCoords } from './coords'

export interface OrbitManeuver {
  epoch: Date
  deltaV: CarthCoords<'m/s'>
}
