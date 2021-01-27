import { Unit } from './unit'

export type Mass = Unit<'kg'>
export type Distance = Unit<'m'>
export type Area = Unit<'m^2'>
export type Volume = Unit<'m^3'>
export type Density = Unit<'kg/m^3'>
export type Time = Unit<'s'>
export type Speed = Unit<'m/s'>
export type Force = Unit<'N'>
export type Acceleration = Unit<'m/s^2'>

export const distanceToArea = (r: Distance): Area => (r ** 2) as Area
export const distanceToVolume = (r: Distance): Volume => (r ** 3) as Volume
