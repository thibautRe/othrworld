import { Speed } from '@othrworld/units'
import { Orbit } from '@othrworld/orbital-mechanics'
import { ID } from './id'

/** Orbit to be used in a system */
export type SystemOrbit<TOrbit extends Orbit = Orbit> = TOrbit & {
  parentId: ID<'body'>
}
