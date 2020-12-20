import { createID, ID } from '@othrworld/core'

import { generatePlanet, Planet } from './planet'

interface System {
  id: ID<'system'>
  type: 'system'
  planets: Planet[]
}
export const generateSystem = (): System => {
  const amtPlanets = Math.floor(Math.random() * 10)

  return {
    id: createID(),
    type: 'system',
    planets: new Array(amtPlanets).fill(null).map(generatePlanet),
  }
}
