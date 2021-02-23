export const G = 6.6743e-11

// JS `%` operation is not the one expected for negative values.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
export const realModulo = (val: number, modulo: number): number =>
  ((val % modulo) + modulo) % modulo

/**
 * Clamps value between -1 and 1, useful for `Math.acos()` calls where float
 * precision can get messy
 */
export const acosClamp = (val: number) => Math.min(1, Math.max(-1, val))
