import { ID } from './types/id'

export const createID = <TBrand extends string>(): ID<TBrand> =>
  (Math.random() * 10000000000000).toString() as ID<TBrand>
