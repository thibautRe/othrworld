import { Unit } from '@othrworld/units'

// These anomaly types are unitless but it's easier to type them properly in TS
// in order to not accidentally mix them up
export type MeanAnomaly = Unit<'meanAnomaly'>
export type EccentricAnomaly = Unit<'eccentricAnomaly'>
export type TrueAnomaly = Unit<'trueAnomaly'>
