import { Body } from '../types/body'

const getSphereVolume = (r: number) => (4 / 3) * Math.PI * r ** 3

/** @unit km^3 */
export const getBodyVolume = (b: Body) => getSphereVolume(b.radius)
