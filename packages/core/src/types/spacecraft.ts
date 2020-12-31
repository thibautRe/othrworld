import { ID } from "./id";
import { Orbit } from "./orbit";

export interface Spacecraft {
  id: ID<'spacecraft'>
  parentId: ID<'planet'>
  type: 'spacecraft'
  name: string
  orbit: Orbit
}
