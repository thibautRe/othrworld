import { Planet, createID } from '@othrworld/core'
import { generate } from '@othrworld/namegen-nobel'

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
  const name = generate()
  const radius = Math.min(maxRadius, Math.random() * 10)
  const distance = Math.max(minDistance, Math.random() * maxDistance)
  const orbitAngle = Math.random() * Math.PI * 2

  return {
    id: createID(),
    type: 'planet',
    name,
    radius,
    distance,
    orbitAngle,
  }
}
