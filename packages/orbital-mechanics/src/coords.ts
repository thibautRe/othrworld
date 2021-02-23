import { multUnit, sumUnits, unit, Unit } from '@othrworld/units'

export interface RadialCoords<T extends string> {
  r: Unit<T>
  angle: number
}
export interface CarthCoords<T extends string> {
  x: Unit<T>
  y: Unit<T>
}

export const radialToCarth = <T extends string>({
  angle,
  r,
}: RadialCoords<T>): CarthCoords<T> => ({
  x: multUnit(r, Math.cos(angle)),
  y: multUnit(r, Math.sin(angle)),
})

export const carthToRadial = <T extends string>(
  vec: CarthCoords<T>
): RadialCoords<T> => ({
  r: getLen(vec),
  angle: Math.atan2(vec.y, vec.x),
})

// unused
export const rotateCarth = <T extends string>(
  coords: CarthCoords<T>,
  angle: number
): CarthCoords<T> => {
  const radial = carthToRadial(coords)
  radial.angle += angle
  return radialToCarth(radial)
}

export const getLen = <T extends string>(vec: CarthCoords<T>): Unit<T> =>
  unit(Math.hypot(vec.x, vec.y))

export const sumVector = <T extends string>(
  ...vecs: CarthCoords<T>[]
): CarthCoords<T> => ({
  x: sumUnits(...vecs.map((v) => v.x)),
  y: sumUnits(...vecs.map((v) => v.y)),
})

export const multVector = <T extends string>(
  vec: CarthCoords<T>,
  fac: number
): CarthCoords<T> => ({ x: multUnit(vec.x, fac), y: multUnit(vec.y, fac) })

export const unitVector = <T extends string>(
  vec: CarthCoords<T>
): CarthCoords<T> => multVector(vec, 1 / getLen(vec))
