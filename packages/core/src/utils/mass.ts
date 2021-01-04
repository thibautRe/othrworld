import { Body } from '../types/body'
import { Spacecraft, SpacecraftPart } from '../types/spacecraft'
import { getBodyVolume } from './volume'

export const getBodyMass = (b: Body): number => {
  return b.density * getBodyVolume(b)
}

const getSpacecraftPartMass = (part: SpacecraftPart): number => {
  switch (part.type) {
    case 'engine':
      return part.mass
    case 'fuel-container':
      return part.dryMass + part.fuelDensity * part.volume
  }
}

export const getSpacecraftMass = (s: Spacecraft): number => {
  const partsMass = s.parts.reduce((a, p) => a + getSpacecraftPartMass(p), 0)

  return s.dryMass + partsMass
}
