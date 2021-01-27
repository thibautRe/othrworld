import { Unit } from './unit'
import {
  MassUnit,
  VolumeUnit,
  DensityUnit,
  DistanceUnit,
  TimeUnit,
  SpeedUnit,
  AccelerationUnit,
  ForceUnit,
} from './types'

// prettier-ignore
/**
 * Triads are a way to switch between useful units that are linked in a way that
 * the following equation is true: `UP / DOWN = RES`.
 * The name of the triad is usually written so that the 3 units appear in the order UP, DOWN, RES.
 * @example The triad Mass Volume Density validates `Mass / Volume = Density`
 */
const generateTriad = <TUp extends string, TDown extends string, TRes extends string>() => ({
  getUp: (down: Unit<TDown>, res: Unit<TRes>): Unit<TUp> => (res * down) as Unit<TUp>,
  getDown: (up: Unit<TUp>, res: Unit<TRes>): Unit<TDown> => (up / res) as Unit<TDown>,
  getRes: (up: Unit<TUp>, down: Unit<TDown>): Unit<TRes> => (up / down) as Unit<TRes>,
})

// prettier-ignore
export const massVolumeDensityTriad = generateTriad<MassUnit, VolumeUnit, DensityUnit>()

// prettier-ignore
export const distanceTimeSpeedTriad = generateTriad<DistanceUnit, TimeUnit, SpeedUnit>()

// prettier-ignore
export const speedTimeAccelerationTriad = generateTriad<SpeedUnit, TimeUnit, AccelerationUnit>()

// prettier-ignore
export const forceMassAccelerationTriad = generateTriad<ForceUnit, MassUnit, AccelerationUnit>()
