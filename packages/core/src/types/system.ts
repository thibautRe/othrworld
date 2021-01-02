import { ID } from './id'
import { Body } from './body'
import { Spacecraft } from './spacecraft'

export interface System {
  id: ID<'system'>
  type: 'system'
  bodies: Body[]
  spacecrafts: Spacecraft[]
}
