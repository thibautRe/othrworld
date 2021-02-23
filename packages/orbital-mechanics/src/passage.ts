import { OrbitEllipse } from './orbit'
import { getOrbitPeriod } from './orbit-characteristics'
import { realModulo } from './utils'

export const getNextPeriapsisPassage = (orbit: OrbitEllipse, t: Date): Date => {
  return new Date(
    realModulo(orbit.t0.getTime() - t.getTime(), getOrbitPeriod(orbit) * 1000) +
      t.getTime()
  )
}
export const getNextApoapsisPassage = (orbit: OrbitEllipse, t: Date): Date => {
  const period = getOrbitPeriod(orbit) * 1000
  return new Date(
    realModulo(orbit.t0.getTime() + period / 2 - t.getTime(), period) +
      t.getTime()
  )
}
