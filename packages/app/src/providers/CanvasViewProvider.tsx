import { zoom, ZoomBehavior } from 'd3-zoom'
import React from 'react'

interface CanvasViewTransform {
  x: number
  y: number
  k: number
}
const defaultTransform: CanvasViewTransform = { x: 0, y: 0, k: 1 }
export interface CanvasViewContext {
  transform: CanvasViewTransform
  zoomBehaviour: ZoomBehavior<SVGSVGElement, unknown>
}
const CanvasViewContext = React.createContext<CanvasViewContext>({
  transform: defaultTransform,

  // @ts-expect-error The zoomBehaviour is initialized in the Provider
  zoomBehaviour: () => {
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

  return (
    <CanvasViewContext.Provider value={{ transform, zoomBehaviour }}>
      {children}
    </CanvasViewContext.Provider>
  )
}

export const useCanvasView = () => React.useContext(CanvasViewContext)
