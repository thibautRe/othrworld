import React from 'react'

// Persistent global reference to the callbacks being run for each animation frame
const callbacks: Array<() => void> = []

let frame = -1
const loopGlobalRaf = () => {
  callbacks.forEach((c) => c())
  frame = requestAnimationFrame(loopGlobalRaf)
}
const startGlobalRaf = () => {
  frame = requestAnimationFrame(loopGlobalRaf)
}
const stopGlobalRaf = () => {
  cancelAnimationFrame(frame)
}

/** Run a callback function on every frame. Try to memoize the callback as much
 * as possible to avoid unnecessary computation
 */
export const useFrame = (callback: (() => void) | null) => {
  // Register item in global array
  React.useEffect(() => {
    if (!callback) return
    callbacks.push(callback)
    if (callbacks.length === 1) {
      startGlobalRaf()
    }
    return () => {
      const callbackIndex = callbacks.indexOf(callback)
      callbacks.splice(callbackIndex, 1)
      if (!callbacks.length) stopGlobalRaf()
    }
  }, [callback])
}
