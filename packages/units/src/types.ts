import { Unit } from './unit'

export type Mass = Unit<'kg'>
export type Distance = Unit<'m'>

export type Volume = Unit<'m^3'>
export const getSphereVolume = (r: Distance): Volume =>
  ((4 / 3) * Math.PI * r ** 3) as Volume

export type Density = Unit<'kg/m^3'>
export const getDensity = (m: Mass, v: Volume): Density => (m / v) as Density
export const getMassFromDensity = (d: Density, v: Volume): Mass =>
  (d * v) as Mass
export const getVolumeFromDensity = (d: Density, m: Mass): Volume =>
  (d / m) as Volume

export type Time = Unit<'s'>
export type Speed = Unit<'m/s'>
export const getSpeed = (s: Distance, t: Time): Speed => (s / t) as Speed

export type Force = Unit<'N'>
export type Acceleration = Unit<'m/s^2'>
export const getAccelerationFromForceMass = (f: Force, m: Mass) =>
  (f / m) as Acceleration
export const getSpeedFromAcceleration = (a: Acceleration, t: Time): Speed =>
  (a * t) as Speed
