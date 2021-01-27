import { Body } from '@othrworld/core'
import {
  Distance,
  distanceToVolume,
  massVolumeDensityTriad,
  multUnit,
} from '@othrworld/units'

export const getSphereVolume = (r: Distance) =>
  multUnit(distanceToVolume(r), (4 / 3) * Math.PI)

export const getBodyMass = (b: Body) =>
  massVolumeDensityTriad.getUp(getSphereVolume(b.radius), b.density)
