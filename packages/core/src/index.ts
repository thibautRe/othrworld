export type ID<TBrand extends string> = string & { __brand: TBrand }

export const createID = <TBrand extends string>(): ID<TBrand> =>
  (Math.random() * 1000000000000).toString() as ID<TBrand>
