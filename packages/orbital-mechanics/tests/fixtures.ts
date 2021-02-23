import { createFixedID, OrbitEllipse, OrbitHyperbola } from '@othrworld/core'
import { unit } from '@othrworld/units'

export const orbitEllipse1: OrbitEllipse = {
  a: unit(100),
  e: 0.1,
  phi: 0,
  t0: new Date('2020-01-01'),
  parentId: createFixedID('ellipse1'),
  parentMass: unit(100),
}
export const orbitEllipse2: OrbitEllipse = {
  a: unit(5592921),
  e: 0.9,
  phi: 1.0313843922,
  t0: new Date('2020-01-02'),
  parentId: createFixedID('ellipse2'),
  parentMass: unit(120459201),
}
export const orbitEllipseMoon: OrbitEllipse = {
  a: unit(384399000),
  e: 0.0549,
  parentId: createFixedID('Moon'),
  parentMass: unit(5.97237e24),
  phi: 0,
  t0: new Date('2020-05-05'),
}
export const orbitHyperbola1: OrbitHyperbola = {
  a: unit(-204943921),
  e: 1.4,
  phi: 0.5328294,
  t0: new Date('2020-01-20'),
  parentId: createFixedID('hyperbola1'),
  parentMass: unit(120459201),
}
