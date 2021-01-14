import { Spacecraft, SpacecraftPart } from '@othrworld/core'

const getSpacecraftPartDryMass = (part: SpacecraftPart): number => {
  switch (part.type) {
    case 'engine':
      return part.mass
    case 'fuel-container':
      return part.dryMass
  }
}

const getSpacecraftPartFuelMass = (part: SpacecraftPart): number => {
  switch (part.type) {
    case 'fuel-container':
      return part.fuelDensity * part.fuelVolume
    case 'engine':
      return 0
  }
}

export const getSpacecraftDryMass = (s: Spacecraft): number =>
  s.parts.reduce((a, p) => a + getSpacecraftPartDryMass(p), 0) + s.dryMass

export const getSpacecraftFuelMass = (s: Spacecraft): number =>
  s.parts.reduce((a, p) => a + getSpacecraftPartFuelMass(p), 0)

export const getSpacecraftMass = (s: Spacecraft): number =>
  getSpacecraftDryMass(s) + getSpacecraftFuelMass(s)
