import { Unit } from './unit'

export type MassUnit = 'kg'
export type Mass = Unit<MassUnit>

export type DistanceUnit = 'm'
export type Distance = Unit<DistanceUnit>

export type AreaUnit = 'm^2'
export type Area = Unit<AreaUnit>

export type VolumeUnit = 'm^3'
export type Volume = Unit<VolumeUnit>

export type DensityUnit = 'kg/m^3'
export type Density = Unit<DensityUnit>

export type TimeUnit = 's'
export type Time = Unit<TimeUnit>

export type SpeedUnit = 'm/s'
export type Speed = Unit<SpeedUnit>

export type ForceUnit = 'N'
export type Force = Unit<ForceUnit>

export type AccelerationUnit = 'm/s^2'
export type Acceleration = Unit<AccelerationUnit>

export const distanceToArea = (r: Distance): Area => (r ** 2) as Area
export const distanceToVolume = (r: Distance): Volume => (r ** 3) as Volume
