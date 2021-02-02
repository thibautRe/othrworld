import type {
  Unit,
  Mass,
  Volume,
  Density,
  Distance,
  Time,
  Speed,
  Acceleration,
  Force,
  Energy,
  Power,
  Voltage,
  Current,
  Impedance,
  Area,
  Pressure,
} from './types'

/**
 * Triads are a way to switch between useful units that are linked in a way that
 * the following equation is true: `UP / DOWN = RES`.
 * The name of the triad is usually written so that the 3 units appear in the order UP, DOWN, RES.
 * @example
 * Mass / Volume = Density
 */
const triad = <
  TUp extends Unit<string>,
  TDown extends Unit<string>,
  TRes extends Unit<string>
>() => ({
  getUp: (down: TDown, res: TRes): TUp => (res * down) as TUp,
  getDown: (up: TUp, res: TRes): TDown => (up / res) as TDown,
  getRes: (up: TUp, down: TDown): TRes => (up / down) as TRes,
})

export const massVolumeDensityTriad = triad<Mass, Volume, Density>()
export const distanceTimeSpeedTriad = triad<Distance, Time, Speed>()
export const speedTimeAccelerationTriad = triad<Speed, Time, Acceleration>()
export const forceMassAccelerationTriad = triad<Force, Mass, Acceleration>()
export const forceAreaPressureTriad = triad<Force, Area, Pressure>()
export const energyTimePowerTriad = triad<Energy, Time, Power>()
export const energyDistanceForceTriad = triad<Energy, Distance, Force>()
export const energyVolumePressureTriad = triad<Energy, Volume, Pressure>()
export const powerSpeedForceTriad = triad<Power, Speed, Force>()
export const powerVoltageCurrentTriad = triad<Power, Voltage, Current>()
export const voltageCurrentImpedanceTriad = triad<Voltage, Current, Impedance>()
