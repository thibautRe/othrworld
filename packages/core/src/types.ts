export type ID<TBrand extends string> = string & { __brand: TBrand }
export interface System {
  id: ID<'system'>
  type: 'system'
  planets: Planet[]
}

export interface Planet {
  id: ID<'planet'>
  type: 'planet'
  name: string
  radius: number
  distance: number
  moons: Planet[]
}
