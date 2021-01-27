export type Unit<T extends string> = number & { __dimension: T }

/** Construct a typed unit of a given dimension */
export const unit = <T extends string>(val: number): Unit<T> => val as Unit<T>

/** Removes the type anotation of a Unit value */
export const unitless__unsafe = <T extends string>(unit: Unit<T>): number =>
  unit as number

/** Sum a serie of similarly dimensionned units */
export const sumUnits = <T extends string>(...val: Unit<T>[]): Unit<T> =>
  val.reduce((a, b) => a + b, 0) as Unit<T>

export const subUnits = <T extends string>(
  val1: Unit<T>,
  val2: Unit<T>
): Unit<T> => (val1 - val2) as Unit<T>

/** Multiply a unit by a scalair */
export const multUnit = <T extends string>(u: Unit<T>, l: number): Unit<T> =>
  (u * l) as Unit<T>

/** Average a serie of similarly dimensionned units */
export const avgUnits = <T extends string>(...val: Unit<T>[]): Unit<T> =>
  multUnit(sumUnits(...val), 1 / val.length)
