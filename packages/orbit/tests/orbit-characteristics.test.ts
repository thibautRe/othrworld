import { getOrbitPeriod, getApoapsis, getPeriapsis } from '../src'
import {
  orbitEllipse1,
  orbitEllipse2,
  orbitEllipseMoon,
  orbitHyperbola1,
} from './fixtures'

test('Apoapsis', () => {
  expect(getApoapsis(orbitEllipse1)).toMatchInlineSnapshot(`110.00000000000001`)
  expect(getApoapsis(orbitEllipse2)).toMatchInlineSnapshot(`10626549.9`)

  expect(getApoapsis(orbitEllipseMoon)).toMatchInlineSnapshot(
    `405502505.09999996`
  )
})

test('Periapsis', () => {
  expect(getPeriapsis(orbitEllipse1)).toMatchInlineSnapshot(`90`)
  expect(getPeriapsis(orbitEllipse2)).toMatchInlineSnapshot(`559292.0999999999`)
  expect(getPeriapsis(orbitHyperbola1)).toMatchInlineSnapshot(
    `81977568.39999998`
  )
  expect(getPeriapsis(orbitEllipseMoon)).toMatchInlineSnapshot(
    `363295494.90000004`
  )
})

test('Period', () => {
  expect(getOrbitPeriod(orbitEllipse1)).toMatchInlineSnapshot(
    `76908972.01971823`
  )
  expect(getOrbitPeriod(orbitEllipse2)).toMatchInlineSnapshot(
    `926861931278.5244`
  )

  expect(getOrbitPeriod(orbitEllipseMoon)).toMatchInlineSnapshot(
    `2371794.3364404202`
  )
})
