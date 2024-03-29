import { Spacecraft, SpacecraftPart } from '@othrworld/core'
import { Mass, unit, sumUnits, massVolumeDensityTriad } from '@othrworld/units'

const getSpacecraftPartDryMass = (part: SpacecraftPart): Mass => {
  switch (part.type) {
    case 'engine':
      return part.mass
    case 'fuel-container':
      return part.dryMass
    case 'battery':
      return part.mass
  }
}

const getSpacecraftPartFuelMass = (part: SpacecraftPart): Mass => {
  switch (part.type) {
    case 'fuel-container':
      return massVolumeDensityTriad.getUp(part.fuelVolume, part.fuelDensity)
    default:
      return unit(0)
  }
}

export const getSpacecraftDryMass = (s: Spacecraft) =>
  sumUnits(s.dryMass, ...s.parts.map(getSpacecraftPartDryMass))

export const getSpacecraftFuelMass = (s: Spacecraft) =>
  sumUnits(...s.parts.map(getSpacecraftPartFuelMass))

export const getSpacecraftMass = (s: Spacecraft) =>
  sumUnits(getSpacecraftDryMass(s), getSpacecraftFuelMass(s))
