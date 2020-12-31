export type ID<TBrand extends string> = string & { __brand: TBrand }
