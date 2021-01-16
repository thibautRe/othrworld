import { Planet, createID } from '@othrworld/core'
import { randFloat } from '@othrworld/gen-core'
import { generate } from '@othrworld/namegen-nobel'
import { Mass, unit } from '@othrworld/units'

interface GeneratePlanetProps {
  parentId?: Planet['id']
  parentMass: Mass
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
  const t0 = new Date()
  t0.setTime(Math.random() * 100000000)

  return {
    id: createID(),
    type: 'planet',
    name,
    radius: unit(randFloat(maxRadius, minRadius)),
    density: unit(randFloat(10, 0.1)),
    orbit: {
      parentId,
      parentMass,
      a: unit(randFloat(maxDistance, minDistance)),
      e: Math.random() ** 3,
      phi: Math.random() * 2 * Math.PI,
      t0,
    },
    atmosphere: {
      density: unit(1),
      altitudeHalf: unit(5),
      composition: {
        argon: 1,
      },
    },
  }
}
