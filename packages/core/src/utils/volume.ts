import { Planet } from '../types/planet'

/** @unit km^3 */
export const getPlanetVolume = (p: Planet) => (4 / 3) * Math.PI * p.radius ** 3
