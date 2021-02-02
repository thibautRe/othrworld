type Dim = '__dimension'
export type Unit<T extends string> = number & { [dim in Dim]: T }
export type DimOf<U extends Unit<string>> = U[Dim]

// SI units
export type Mass = Unit<'kg'>
export type Distance = Unit<'m'>
export type Current = Unit<'A'>
export type Time = Unit<'s'>
export type Temperature = Unit<'K'>

// Derived units
export type Area = Unit<'m^2'>
export type Volume = Unit<'m^3'>
export type Density = Unit<'kg/m^3'>
export type Speed = Unit<'m/s'>
export type Acceleration = Unit<'m/s^2'>
export type Pressure = Unit<'Pa'>
export type Force = Unit<'N'>
export type Power = Unit<'W'>
export type Energy = Unit<'J'>
export type Voltage = Unit<'V'>
export type Impedance = Unit<'Ω'>

// Factor-derived units
export type TemperatureCelsius = Unit<'°C'>
