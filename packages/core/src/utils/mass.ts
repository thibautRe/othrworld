import { Body } from '../types/body'
import { Spacecraft, SpacecraftPart } from '../types/spacecraft'
import { getBodyVolume } from './volume'

export const getBodyMass = (b: Body): number => {
  return b.density * getBodyVolume(b)
}
