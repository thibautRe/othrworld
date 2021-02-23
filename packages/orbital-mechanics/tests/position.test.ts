import { unit } from '@othrworld/units'
import {
  getApoapsis,
  getNextDateForDistance,
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
  getPeriapsis,
  getOrbitPeriod,
} from '../src'
import { orbitEllipse1, orbitEllipseMoon, orbitHyperbola1 } from './fixtures'

describe('getNextDateForDistance', () => {
  test('Ellipse Orbit 1', () => {
    expect(
      getNextDateForDistance(orbitEllipse1, unit(110), new Date('2021-02-28'))
    ).toMatchInlineSnapshot(`2021-03-21T01:48:05.696Z`)
  })

  test('Should handle edge cases of apoapsis', () => {
    expect(
      getNextDateForDistance(
        orbitEllipse1,
        getApoapsis(orbitEllipse1),
        new Date('2021-01-01')
      ).getTime()
    ).not.toBeNaN()
  })

  test('Date for Distance and Apoapsis passage should be equal', () => {
    const t = new Date('2021-02-21')
    const passageApo = getNextApoapsisPassage(orbitEllipse1, t)
    const passageDate = getNextDateForDistance(
      orbitEllipse1,
      getApoapsis(orbitEllipse1),
      t
    )
    expect(passageDate).toEqual(passageApo)
  })

  test('Date for Distance and Periapsis passage should be equal', () => {
    const t = new Date('2021-05-10')
    const passageApo = getNextPeriapsisPassage(orbitEllipse1, t)
    const passageDate = getNextDateForDistance(
      orbitEllipse1,
      getPeriapsis(orbitEllipse1),
      t
    )
    expect(passageDate).toEqual(passageApo)
  })

  describe('Elliptical Orbit', () => {
    const t = new Date('2030-04-04')
    const nextApo = getNextDateForDistance(
      orbitEllipseMoon,
      getApoapsis(orbitEllipseMoon),
      t
    )

    test('Next date should be after given date', () => {
      expect(nextApo.getTime()).toBeGreaterThan(t.getTime())
    })

    test('Next date should be within 1 orbit period', () => {
      expect((nextApo.getTime() - t.getTime()) / 1000).toBeLessThan(
        getOrbitPeriod(orbitEllipseMoon)
      )
    })
  })

  describe('Hyperbolic Orbit', () => {
    test('Should find a next date', () => {
      const t = new Date('2020-01-05')
      const nextPeri = getNextDateForDistance(
        orbitHyperbola1,
        getPeriapsis(orbitHyperbola1),
        t
      )
      expect(nextPeri).not.toBeNull()
      expect(nextPeri.getTime()).toBeGreaterThan(t.getTime())
    })

    test('Should return null if there is no solution', () => {
      const t = new Date('2020-02-20')
      const nextPeri = getNextDateForDistance(
        orbitHyperbola1,
        getPeriapsis(orbitHyperbola1),
        t
      )
      expect(nextPeri).toBeNull()
    })
  })
})
