import { Planet } from '../types/planet'
import { getPlanetVolume } from './volume'

export const getPlanetMass = (p: Planet): number => {
  return p.density * getPlanetVolume(p)
}
