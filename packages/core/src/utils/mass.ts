import { Body } from '../types/body'
import { getBodyVolume } from './volume'

export const getBodyMass = (b: Body): number => {
  return b.density * getBodyVolume(b)
}
