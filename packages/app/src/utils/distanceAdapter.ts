// SVGs don't work well with ultra large distances.
export const adaptDistanceToSVG = (realDist: number): number => realDist * 1e-5
