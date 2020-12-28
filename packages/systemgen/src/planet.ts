import { Planet, createID } from '@othrworld/core'
import { generate } from '@othrworld/namegen-nobel'

interface GeneratePlanetProps {
  parentId?: Planet['id']
  maxRadius: number
  minDistance: number
  maxDistance: number
}
export const generatePlanet = ({
  parentId,
  maxRadius,
  minDistance,
  maxDistance,
}: GeneratePlanetProps): Planet => {
  const name = generate()
  const radius = Math.min(maxRadius, Math.random() * 10)
  const a = Math.max(minDistance, Math.random() * maxDistance)
  const orbitAngle = Math.random() * Math.PI * 2

  return {
    id: createID(),
    parentId,
    type: 'planet',
    name,
    radius,
    orbit: {
      a,
      e: Math.random() ** 3,
      phi: 0, //Math.random() * 2 * Math.PI,
      angle: 0, //orbitAngle,
    },
  }
}
