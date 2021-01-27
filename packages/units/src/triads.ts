import { Unit } from './unit'
import {
  Mass,
  Volume,
  Density,
  Distance,
  Time,
  Speed,
  Acceleration,
  Force,
} from './types'

// prettier-ignore
/**
 * Triads are a way to switch between useful units that are linked in a way that
 * the following equation is true: `UP / DOWN = RES`.
 * The name of the triad is usually written so that the 3 units appear in the order UP, DOWN, RES.
 * @example
 * Mass / Volume = Density
 */
const generateTriad = <TUp extends Unit<string>, TDown extends Unit<string>, TRes extends Unit<string>>() => ({
  getUp: (down: TDown, res: TRes): TUp => (res * down) as TUp,
  getDown: (up: TUp, res: TRes): TDown => (up / res) as TDown,
  getRes: (up: TUp, down: TDown): TRes => (up / down) as TRes,
})

// prettier-ignore
export const massVolumeDensityTriad = generateTriad<Mass, Volume, Density>()
// prettier-ignore
export const distanceTimeSpeedTriad = generateTriad<Distance, Time, Speed>()
// prettier-ignore
export const speedTimeAccelerationTriad = generateTriad<Speed, Time, Acceleration>()
// prettier-ignore
export const forceMassAccelerationTriad = generateTriad<Force, Mass, Acceleration>()
