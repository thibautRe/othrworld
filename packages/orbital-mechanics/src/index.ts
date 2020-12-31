import { getPlanetMass, Orbit, Planet } from '@othrworld/core'
import { CarthCoords, RadialCoords, radialToCarth } from './coords'

export const G = 6.6743e-11

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
export const getMeanMotion = (orbit: Orbit) =>
  // Unit hack: G needs meter, not KM
  Math.sqrt((G * orbit.parentMass) / (orbit.a * 1e3) ** 3)

/** Returns the period */
export const getOrbitPeriod = (orbit: Orbit) =>
  (2 * Math.PI) / getMeanMotion(orbit)

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
    ((t.getTime() / 1000 - orbit.t0.getTime() / 1000) % getOrbitPeriod(orbit))

const ε = 1e-4
const maxIter = 10

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
export const getTrueAnomaly = (orbit: Orbit, t: Date) =>
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
const getPlanetSOIRadiusAtDistance = (planet: Planet, r: number): number =>
  r * Math.pow(getPlanetMass(planet) / (3 * planet.orbit.parentMass), 1 / 3)

/** Radius of the SOI at a given date */
export const getPlanetSOIRadius = (planet: Planet, t: Date): number => {
  const { r } = getRadialCoords(planet.orbit, t)
  return getPlanetSOIRadiusAtDistance(planet, r)
}

/** Return the bounds of the SOI sphere (smallest at perihelion, biggest at aphelion) */
export const getPlanetSOIRadiusBounds = (planet: Planet): [number, number] => [
  getPlanetSOIRadiusAtDistance(planet, getPeriapsis(planet.orbit)),
  getPlanetSOIRadiusAtDistance(planet, getApoapsis(planet.orbit)),
]
