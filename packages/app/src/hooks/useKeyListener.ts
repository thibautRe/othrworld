import React from 'react'

/**
 * Adds a global key listener that runs a given callback
 *
 * @note Try to memoize the callback as much as possible to avoid unnecessary computation
 * @performance use a single window event listener for all callers of the hook, similar to useFrame
 */
export const useKeyListener = (
  key: KeyboardEvent['key'],
  callback: () => void
) => {
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (key === e.key) callback()
    }
    window.addEventListener('keypress', listener)
    return () => window.removeEventListener('keypress', listener)
  }, [key, callback])
}
