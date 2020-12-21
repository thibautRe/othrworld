import React from 'react'
import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'

interface CanvasViewTransform {
  x: number
  y: number
  k: number
}
const defaultTransform: CanvasViewTransform = { x: 0, y: 0, k: 1 }
export interface CanvasViewContext {
  transform: CanvasViewTransform
  applyZoomEvents: (elt: SVGSVGElement) => void
}
const CanvasViewContext = React.createContext<CanvasViewContext>({
  transform: defaultTransform,
  applyZoomEvents: () => {
    throw new Error('No CanvasViewProvider found')
  },
})

export const CanvasViewProvider: React.FC = ({ children }) => {
  const [transform, setTransform] = React.useState<CanvasViewTransform>(
    defaultTransform
  )

  const [zoomBehaviour] = React.useState(() =>
    zoom<SVGSVGElement, unknown>().on('zoom', (e) => setTransform(e.transform))
  )

  const applyZoomEvents = React.useCallback(
    (elt: SVGSVGElement) => {
      select(elt).call(zoomBehaviour)
    },
    [zoomBehaviour]
  )

  return (
    <CanvasViewContext.Provider value={{ transform, applyZoomEvents }}>
      {children}
    </CanvasViewContext.Provider>
  )
}

export const useCanvasView = () => React.useContext(CanvasViewContext)
