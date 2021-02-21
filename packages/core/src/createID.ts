import { ID } from './types/id'

/** Create a new ID with a given Brand */
export const createID = <TBrand extends string>(): ID<TBrand> =>
  (Math.random() * 10000000000000).toString() as ID<TBrand>

/** Create a fixed ID (passed as parameter). Useful in snapshot testing */
export const createFixedID = <TBrand extends string>(id: string): ID<TBrand> =>
  id as ID<TBrand>
