import { ID } from './id'
import { Planet } from './planet'
import { Spacecraft } from './spacecraft'

export interface System {
  id: ID<'system'>
  type: 'system'
  planets: Planet[]
  spacecrafts: Spacecraft[]
}
