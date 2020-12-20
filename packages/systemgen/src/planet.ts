import { ID, createID } from '@othrworld/core'

export interface Planet {
  id: ID<'planet'>
  type: 'planet'
  name: string
  radius: number
}
export const generatePlanet = (): Planet => {
  const name = 'Planet'
  const radius = Math.random() * 0.1
  const dist = Math.random()

  return {
    id: createID(),
    type: 'planet',
    name,
    radius,
  }
}
