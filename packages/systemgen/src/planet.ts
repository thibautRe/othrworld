import { ID, createID } from '@othrworld/core'

export interface Planet {
  id: ID<'planet'>
  type: 'planet'
  name: string
  radius: number
  distance: number
}
export const generatePlanet = (): Planet => {
  const name = 'Planet'
  const radius = Math.random() * 10
  const distance = Math.random() * 1000

  return {
    id: createID(),
    type: 'planet',
    name,
    radius,
    distance,
  }
}
