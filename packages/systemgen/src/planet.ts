import { Planet, createID } from '@othrworld/core'
import { generate } from '@othrworld/namegen-nobel'

interface GeneratePlanetProps {
  parentId?: Planet['id']
  parentMass: number
  minRadius: number
  maxRadius: number
  minDistance: number
  maxDistance: number
}
export const generatePlanet = ({
  parentId,
  parentMass,
  minRadius,
  maxRadius,
  minDistance,
  maxDistance,
}: GeneratePlanetProps): Planet => {
  const name = generate()
  const radius = Math.max(minRadius, Math.random() * maxRadius)
  const a = Math.max(minDistance, Math.random() * maxDistance)
  const density = Math.max(1e11, Math.random() * 1e13)
  const t0 = new Date()
  t0.setTime(Math.random() * 1000000)

  return {
    id: createID(),
    parentId,
    type: 'planet',
    name,
    radius,
    density,
    orbit: {
      parentMass,
      a,
      e: Math.random() ** 3,
      phi: Math.random() * 2 * Math.PI,
      t0,
    },
  }
}
