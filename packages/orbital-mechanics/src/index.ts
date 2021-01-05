import { Body, getBodyMass, Orbit } from '@othrworld/core'
import {
  CarthCoords,
  RadialCoords,
  carthToRadial,
  radialToCarth,
  rotateCarth,
  unitVector,
} from './coords'

// 6.6743e-11 using kg and m as unit
// Here we use kg and km as base units
const G = 6.6743e-20

// JS `%` operation is not the one expected for negative values.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
const realModulo = (val: number, modulo: number): number =>
  ((val % modulo) + modulo) % modulo

/** Returns the periapsis of a given orbit */
export const getPeriapsis = (orbit: Orbit) => (1 - orbit.e) * orbit.a

/** Returns the apoapsis of a given orbit */
export const getApoapsis = (orbit: Orbit) => (1 + orbit.e) * orbit.a

/** Returns the semi-minor axis of a given orbit */
export const getSemiMinorAxis = (orbit: Orbit) =>
  orbit.a * Math.sqrt(1 - orbit.e ** 2)

/** Returns the current distance for a given true anomaly */
const getDistanceForTrueAnomaly = (orbit: Orbit, trueAnomaly: number) =>
  (orbit.a * (1 - orbit.e ** 2)) / (1 + orbit.e * Math.cos(trueAnomaly))

/** Returns the angular speed for a circular orbit to complete an orbit */
const getMeanMotion = (orbit: Orbit) =>
  Math.sqrt((G * orbit.parentMass) / orbit.a ** 3)

/** Returns the period */
const getOrbitPeriod = (orbit: Orbit) => (2 * Math.PI) / getMeanMotion(orbit)

/**
 * Returns the mean anomaly at a given time
 * This function takes care of using the "modulo" operator on the period
 *
 * @performance There is possibly some performance stuff to do here because meanMotion and getOrbit
 * period are heavily linked and don't depend on time
 */
const getMeanAnomaly = (orbit: Orbit, t: Date, M0 = 0) =>
  M0 +
  getMeanMotion(orbit) *
    realModulo(
      t.getTime() / 1000 - orbit.t0.getTime() / 1000,
      getOrbitPeriod(orbit)
    )

const ε = 1e-4
const maxIter = 11

/** @link https://github.com/benelsen/orb/blob/master/src/position/keplerian.js source of the alg */
const getEccentricAnomaly = (orbit: Orbit, t: Date) => {
  const { e } = orbit
  const M = getMeanAnomaly(orbit, t)
  let E = e < 0.8 ? M : Math.PI

  let dE = 1
  let i = 0
  while (Math.abs(dE) > ε && i < maxIter) {
    dE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E))
    E += dE
    i++
  }

  if (i >= maxIter) {
    console.warn('Max iterations reached in Kepler equation solving.')
    console.warn({ M, dE, i, orbit, t })
  }

  return E
}

/** Returns the True Anomaly at a given Date */
const getTrueAnomaly = (orbit: Orbit, t: Date) =>
  2 *
  Math.atan(
    Math.sqrt((1 + orbit.e) / (1 - orbit.e)) *
      Math.tan(getEccentricAnomaly(orbit, t) / 2)
  )

const getRadialCoords = (orbit: Orbit, t: Date): RadialCoords => {
  const trueAnomaly = getTrueAnomaly(orbit, t)
  const r = getDistanceForTrueAnomaly(orbit, trueAnomaly)
  return { r, angle: trueAnomaly }
}

export const getCarthesianCoords = (orbit: Orbit, t: Date): CarthCoords => {
  const rad = getRadialCoords(orbit, t)
  rad.angle += orbit.phi
  return radialToCarth(rad)
}

// Solve GMp/R^2 = GMpar/(R1-R)^2 for R
// (R1-R)/R = sqrt(Mpar/Mp) = a
// R1-R = R*a <=> R = R1/(1+sqrt(Mpar/Mp))
// https://en.wikipedia.org/wiki/Hill_sphere
const getBodySOIRadiusAtDistance = (body: Body, r: number): number =>
  r * Math.pow(getBodyMass(body) / (3 * body.orbit.parentMass), 1 / 3)

/** Radius of the SOI at a given date */
export const getBodySOIRadius = (body: Body, t: Date): number => {
  const { r } = getRadialCoords(body.orbit, t)
  return getBodySOIRadiusAtDistance(body, r)
}

/** Return the bounds of the SOI sphere (smallest at perihelion, biggest at aphelion) */
export const getBodySOIRadiusBounds = (body: Body): [number, number] => [
  getBodySOIRadiusAtDistance(body, getPeriapsis(body.orbit)),
  getBodySOIRadiusAtDistance(body, getApoapsis(body.orbit)),
]

const getSpeedAtDistance = (orbit: Orbit, r: number): number =>
  Math.sqrt(G * orbit.parentMass * (2 / r - 1 / orbit.a))

export const getSpeed = (orbit: Orbit, t: Date): number =>
  getSpeedAtDistance(orbit, getRadialCoords(orbit, t).r)

/** Returns a carthesian vector describing the speed item on the orbit */
export const getSpeedVector = (orbit: Orbit, t: Date): CarthCoords => {
  const { angle } = getRadialCoords(orbit, t)
  const p = orbit.a * (1 - orbit.e * orbit.e)

  return rotateCarth(
    {
      x: -Math.sqrt((G * orbit.parentMass) / p) * Math.sin(angle),
      y: Math.sqrt((G * orbit.parentMass) / p) * (orbit.e + Math.cos(angle)),
    },
    orbit.phi
  )
}

export const recalculateOrbitForPosAndSpeed = (
  orbit: Orbit,
  pos: CarthCoords,
  speed: CarthCoords,
  t: Date
): Orbit => {
  const mu = G * orbit.parentMass
  const r = Math.hypot(pos.x, pos.y)
  const a = (mu * r) / (2 * mu - r * (speed.x ** 2 + speed.y ** 2))

  const h = pos.x * speed.y - pos.y * speed.x
  const ex = pos.x / r - (h * speed.y) / mu
  const ey = pos.y / r + (h * speed.x) / mu
  const e = Math.hypot(ex, ey)

  const PhiQuadrantAdjust = ex > 0
  const phi = Math.atan(ey / ex) + (PhiQuadrantAdjust ? Math.PI : 0)

  const EquadrantAdjust = -ey * pos.x + ex * pos.y > 0
  const E = Math.acos((1 - r / a) / e) * (EquadrantAdjust ? -1 : 1)
  const tDelta = Math.sqrt(Math.pow(a, 3) / mu) * (E - e * Math.sin(E))
  const t0 = new Date(t.getTime() - tDelta * 1000)

  return {
    a,
    e,
    parentMass: orbit.parentMass,
    phi,
    t0,
  }
}

export const getNextPeriapsisPassage = (orbit: Orbit, t: Date): Date => {
  return new Date(
    realModulo(orbit.t0.getTime() - t.getTime(), getOrbitPeriod(orbit) * 1000) +
      t.getTime()
  )
}
export const getNextApoapsisPassage = (orbit: Orbit, t: Date): Date => {
  const period = getOrbitPeriod(orbit) * 1000
  return new Date(
    realModulo(orbit.t0.getTime() + period / 2 - t.getTime(), period) +
      t.getTime()
  )
}

interface SpeedCoords {
  /** Positive for prograde, negative for retrograde */
  prograde: number
  /** Positive for outside, negative for inside */
  normal: number
}
export const applySpeedChange = (
  orbit: Orbit,
  t: Date,
  { prograde, normal }: SpeedCoords
): Orbit => {
  const currentS = getSpeedVector(orbit, t)
  const currentP = getCarthesianCoords(orbit, t)

  const unitS = unitVector(currentS)
  return recalculateOrbitForPosAndSpeed(
    orbit,
    currentP,
    {
      x: currentS.x + unitS.x * prograde - unitS.y * normal,
      y: currentS.y + unitS.y * prograde + unitS.x * normal,
    },
    t
  )
}
