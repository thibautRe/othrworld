/**
 * Memoize a function with only 1 parameter using a WeakMap
 * @example
 *   const myExpansiveFunction = (data: Data): boolean => {
 *     // intense machine learning algorithm here
 *   }
 *   const memoizedExpansiveFunction = withMemoSimple(myExpansiveFunction)
 **/
export const withMemoSimple = <P extends object, R>(fun: (p: P) => R) => {
  const wm = new WeakMap<P, R>()
  return (p: P): R => {
    if (wm.has(p)) return wm.get(p)
    const r = fun(p)
    wm.set(p, r)
    return r
  }
}

/** Memoize a function with 2 paramaters using a WeakMap */
export const withMemoDouble = <P1 extends object, P2 extends object, R>(
  fun: (p1: P1, p2: P2) => R
) => {
  const p1wm = new WeakMap<P1, WeakMap<P2, R>>()
  return (p1: P1, p2: P2): R => {
    let p2wm: WeakMap<P2, R>
    if (p1wm.has(p1)) {
      p2wm = p1wm.get(p1)
    } else {
      p2wm = new WeakMap<P2, R>()
      p1wm.set(p1, p2wm)
    }

    if (p2wm.has(p2)) return p2wm.get(p2)
    const r = fun(p1, p2)
    p2wm.set(p2, r)
    return r
  }
}
