import { Body } from '../types/body'

/** @unit km^3 */
export const getBodyVolume = (b: Body) => (4 / 3) * Math.PI * b.radius ** 3
