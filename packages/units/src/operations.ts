import { Unit } from './types'

/** Construct a typed unit of a given dimension */
export const unit = <T extends string>(val: number): Unit<T> => val as Unit<T>

/** Sum a serie of similarly dimensionned units */
export const sumUnits = <T extends string>(...val: Unit<T>[]): Unit<T> =>
  unit(val.reduce((a, b) => a + b, 0))

export const subUnits = <T extends string>(
  val1: Unit<T>,
  val2: Unit<T>
): Unit<T> => unit(val1 - val2)

/** Multiply a unit by a scalair */
export const multUnit = <T extends string>(u: Unit<T>, l: number): Unit<T> =>
  unit(u * l)

/** Average a serie of similarly dimensionned units */
export const avgUnits = <T extends string>(...val: Unit<T>[]): Unit<T> =>
  multUnit(sumUnits(...val), 1 / val.length)
