import { Body } from '@othrworld/core'
import { getMassFromDensity, getSphereVolume, Mass } from '@othrworld/units'

export const getBodyMass = (b: Body): Mass => {
  return getMassFromDensity(b.density, getSphereVolume(b.radius))
}
