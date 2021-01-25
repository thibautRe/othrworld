import { multUnit, unit, Unit } from '@othrworld/units'

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

// unused
export const carthToRadial = <T extends string>({
  x,
  y,
}: CarthCoords<T>): RadialCoords<T> => ({
  r: unit(Math.hypot(x, y)),
  angle: Math.atan2(y, x),
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

export const unitVector = <T extends string>(
  vec: CarthCoords<T>
): CarthCoords<T> => {
  const len = getLen(vec)
  return { x: multUnit(vec.x, 1 / len), y: multUnit(vec.y, 1 / len) }
}
