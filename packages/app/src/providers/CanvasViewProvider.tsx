import React from 'react'
import { zoom, zoomIdentity } from 'd3-zoom'
import { select, Selection } from 'd3-selection'

interface CanvasViewTransform {
  x: number
  y: number
  k: number
}
const defaultTransform: CanvasViewTransform = { x: 0, y: 0, k: 1 }
export interface CanvasViewContext {
  transform: CanvasViewTransform
  setTransform: (t: CanvasViewTransform) => void
  applyZoomEvents: (elt: SVGSVGElement) => void
}

const contextErrorFunction = () => {
  throw new Error('No CanvasViewProvider found')
}
const CanvasViewContext = React.createContext<CanvasViewContext>({
  transform: defaultTransform,
  setTransform: contextErrorFunction,
  applyZoomEvents: contextErrorFunction,
})

type SVGSelection = Selection<SVGSVGElement, unknown, null, undefined>

export const CanvasViewProvider: React.FC = ({ children }) => {
  const [transform, setTransformState] = React.useState<CanvasViewTransform>(
    defaultTransform
  )
  const [zoomBehaviour] = React.useState(() =>
    zoom<SVGSVGElement, unknown>().on('zoom', (e) =>
      setTransformState(e.transform)
    )
  )

  const d3SelectionRef = React.useRef<SVGSelection | null>(null)

  const applyZoomEvents = React.useCallback(
    (elt: SVGSVGElement) => {
      d3SelectionRef.current = select(elt).call(zoomBehaviour)
    },
    [zoomBehaviour]
  )

  // Apply transform to current Selection
  const setTransform = React.useCallback(
    (t: CanvasViewTransform) => {
      if (!d3SelectionRef.current) return
      d3SelectionRef.current.call(
        zoomBehaviour.transform,
        zoomIdentity.translate(t.x, t.y).scale(t.k)
      )
    },
    [zoomBehaviour]
  )

  return (
    <CanvasViewContext.Provider
      value={{ transform, setTransform, applyZoomEvents }}
    >
      {children}
    </CanvasViewContext.Provider>
  )
}

export const useCanvasView = () => React.useContext(CanvasViewContext)
