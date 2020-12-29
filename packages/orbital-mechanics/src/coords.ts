export interface RadialCoords {
  r: number
  angle: number
}
export interface CarthCoords {
  x: number
  y: number
}

export const radialToCarth = ({ angle, r }: RadialCoords): CarthCoords => ({
  x: Math.cos(angle) * r,
  y: Math.sin(angle) * r,
})

// unused
export const carthToRadial = ({ x, y }: CarthCoords): RadialCoords => ({
  r: Math.sqrt(x ** 2 + y ** 2),
  angle: Math.atan(y / x),
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