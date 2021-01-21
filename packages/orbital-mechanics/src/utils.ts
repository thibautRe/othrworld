export const G = 6.6743e-11

// JS `%` operation is not the one expected for negative values.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
export const realModulo = (val: number, modulo: number): number =>
  ((val % modulo) + modulo) % modulo
