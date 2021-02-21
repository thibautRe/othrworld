import { getApoapsis, getPeriapsis } from '../'
import { orbitEllipse1, orbitEllipse2, orbitHyperbola1 } from './fixtures'

test('Apoapsis', () => {
  expect(getApoapsis(orbitEllipse1)).toMatchInlineSnapshot(`110.00000000000001`)
  expect(getApoapsis(orbitEllipse2)).toMatchInlineSnapshot(`10626549.9`)
})

test('Periapsis', () => {
  expect(getPeriapsis(orbitEllipse1)).toMatchInlineSnapshot(`90`)
  expect(getPeriapsis(orbitEllipse2)).toMatchInlineSnapshot(`559292.0999999999`)
  expect(getPeriapsis(orbitHyperbola1)).toMatchInlineSnapshot(
    `81977568.39999998`
  )
})
