import { Planet, createID } from '@othrworld/core'

interface GeneratePlanetProps {
  maxRadius: number
  minDistance: number
  maxDistance: number
}
export const generatePlanet = ({
  maxRadius,
  minDistance,
  maxDistance,
}: GeneratePlanetProps): Planet => {
  const name = 'Planet'
  const radius = Math.min(maxRadius, Math.random() * 10)
  const distance = Math.max(minDistance, Math.random() * maxDistance)

  // const moonsAmt = Math.floor(3*Math.random() ** 4)
  const moonsAmt = 0

  return {
    id: createID(),
    type: 'planet',
    name,
    radius,
    distance,
    moons: new Array(moonsAmt).fill(null).map(() =>
      generatePlanet({
        minDistance: radius * 10,
        maxDistance: radius * 100,
        maxRadius: radius / 100,
      })
    ),
  }
}
