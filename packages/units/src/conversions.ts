import { unit } from './operations'
import {
  Distance,
  Area,
  Volume,
  TemperatureCelsius,
  Temperature,
} from './types'

export const distanceToArea = (r: Distance): Area => (r ** 2) as Area
export const distanceToVolume = (r: Distance): Volume => (r ** 3) as Volume

export const celsius = (t: TemperatureCelsius): Temperature => unit(t + 273.15)
export const toCelsius = (t: Temperature): TemperatureCelsius =>
  unit(t - 273.15)
