import { Distance, multUnit } from '@othrworld/units'

export interface RadialCoords {
  r: Distance
  angle: number
}
export interface CarthCoords {
  x: Distance
  y: Distance
}

export const radialToCarth = ({ angle, r }: RadialCoords): CarthCoords => ({
  x: multUnit(r, Math.cos(angle)),
  y: multUnit(r, Math.sin(angle)),
})

// unused
export const carthToRadial = ({ x, y }: CarthCoords): RadialCoords => ({
  r: Math.hypot(x, y) as Distance,
  angle: Math.atan2(y, x),
})

// unused
export const rotateCarth = (
  coords: CarthCoords,
  angle: number
): CarthCoords => {
  const radial = carthToRadial(coords)
  radial.angle += angle
  return radialToCarth(radial)
}

export const getLen = (vec: CarthCoords) => Math.hypot(vec.x, vec.y) as Distance

export const unitVector = (vec: CarthCoords): CarthCoords => {
  const len = getLen(vec)
  return { x: multUnit(vec.x, 1 / len), y: multUnit(vec.y, 1 / len) }
}
