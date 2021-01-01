import React from 'react'

// Keep track of all event handlers in a global array
// Implementation note: an event handler to the document for each item does not work
// when using nested items that can be esc-keyed.
const _handlers = [] as Array<() => void>

// Keep track of if the global event listener is mounted or not
let _globalMounted = false

// Global event listener
const escKeyCallHandler = (e: KeyboardEvent) => {
  if (_handlers.length === 0) {
    return
  }
  if (e.keyCode === 27) {
    _handlers[_handlers.length - 1]()
  }
}

// Add a handler in the stack
const addHandler = (handler: () => void) => {
  _handlers.push(handler)
}
// Remove a handler from the stack
const removeHandler = (handler: () => void) => {
  _handlers.splice(_handlers.indexOf(handler), 1)
}

// Hook to attach a global document escape key event listener
// NOTE: try to memoize as much as possible your handler using `useCallback`
export const useEscKeyHandler = (handler: (() => void) | null) => {
  // Add and remove the handler in the stack, if present
  React.useEffect(() => {
    if (!handler) return
    addHandler(handler)
    return () => removeHandler(handler)
  }, [handler])

  // Manage the global document handler
  // NOTE - because of the decentralized behaviour, the hooks' returned effect
  // can be ran regardless of if it ran the addEventListener itself.
  React.useEffect(() => {
    if (!_globalMounted && handler) {
      document.addEventListener('keydown', escKeyCallHandler)
      _globalMounted = true
    }
    return () => {
      if (_handlers.length === 0) {
        document.removeEventListener('keydown', escKeyCallHandler)
        _globalMounted = false
      }
    }
  }, [handler])
}
