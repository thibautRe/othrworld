import { Body } from './body'
import { ID } from './id'
import { Orbit } from './orbit'

export interface Spacecraft {
  id: ID<'spacecraft'>
  parentId: Body['id']
  type: 'spacecraft'
  name: string
  orbit: Orbit
}
