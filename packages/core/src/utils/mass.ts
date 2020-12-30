import { Planet } from '../types'
import { getPlanetVolume } from './volume'

export const getPlanetMass = (p: Planet): number => {
  return p.density * getPlanetVolume(p)
}
