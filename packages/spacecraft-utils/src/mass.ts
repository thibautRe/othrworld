import { Spacecraft, SpacecraftPart } from '@othrworld/core'

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
