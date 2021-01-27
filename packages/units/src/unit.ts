type Dim = '__dimension'
export type Unit<T extends string> = number & { [dim in Dim]: T }
export type DimOf<U extends Unit<string>> = U[Dim]

/** Construct a typed unit of a given dimension */
export const unit = <T extends string>(val: number): Unit<T> => val as Unit<T>

/** Sum a serie of similarly dimensionned units */
export const sumUnits = <U extends Unit<string>>(...val: U[]): U =>
  val.reduce((a, b) => a + b, 0) as U

export const subUnits = <U extends Unit<string>>(val1: U, val2: U): U =>
  (val1 - val2) as U

/** Multiply a unit by a scalair */
export const multUnit = <U extends Unit<string>>(u: U, l: number): U =>
  (u * l) as U

/** Average a serie of similarly dimensionned units */
export const avgUnits = <U extends Unit<string>>(...val: U[]): U =>
  multUnit(sumUnits(...val), 1 / val.length)
