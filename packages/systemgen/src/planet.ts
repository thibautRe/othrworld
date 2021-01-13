import { Planet, createID } from '@othrworld/core'
import { randFloat } from '@othrworld/gen-core'
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
  const radius = randFloat(maxRadius, minRadius)
  const a = randFloat(maxDistance, minDistance)
  const density = randFloat(1e13, 1e11)
  const t0 = new Date()
  t0.setTime(Math.random() * 100000000)

  return {
    id: createID(),
    type: 'planet',
    name,
    radius,
    density,
    orbit: {
      parentId,
      parentMass,
      a,
      e: Math.random() ** 3,
      phi: Math.random() * 2 * Math.PI,
      t0,
    },
    atmosphere: {
      density: 1,
      altitudeHalf: 5,
      composition: {
        argon: 1,
      },
    },
  }
}
