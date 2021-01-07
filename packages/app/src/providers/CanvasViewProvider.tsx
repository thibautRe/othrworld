import React from 'react'
import { zoom, zoomIdentity } from 'd3-zoom'
import { select, Selection } from 'd3-selection'

interface CanvasViewTransform {
  x: number
  y: number
  k: number
  globalK: number
}
const defaultTransform: CanvasViewTransform = { x: 0, y: 0, k: 1, globalK: 1 }
export interface CanvasViewContext {
  setTransform: (t: CanvasViewTransform) => void
  applyZoomEvents: (elt: SVGSVGElement) => void
}

const contextErrorFunction = () => {
  throw new Error('No CanvasViewProvider found')
}
const CanvasViewContext = React.createContext<CanvasViewContext>({
  setTransform: contextErrorFunction,
  applyZoomEvents: contextErrorFunction,
})
const CanvasTransformContext = React.createContext<CanvasViewTransform>(
  defaultTransform
)

type SVGSelection = Selection<SVGSVGElement, unknown, null, undefined>

export const CanvasViewProvider: React.FC = ({ children }) => {
  const [transform, setTransformState] = React.useState<CanvasViewTransform>(
    defaultTransform
  )
  const [zoomBehaviour] = React.useState(() =>
    zoom<SVGSVGElement, unknown>()
      .filter((e) => !e.ctrlKey)
      .on('zoom', (e) =>
        setTransformState({ ...e.transform, globalK: e.transform.k })
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
    <CanvasViewContext.Provider value={{ setTransform, applyZoomEvents }}>
      <CanvasTransformProvider transform={transform}>
        {children}
      </CanvasTransformProvider>
    </CanvasViewContext.Provider>
  )
}

export const CanvasTransformProvider: React.FC<{
  transform: CanvasViewTransform
}> = ({ transform, children }) => (
  <CanvasTransformContext.Provider value={transform}>
    {children}
  </CanvasTransformContext.Provider>
)

export const useCanvasView = () => React.useContext(CanvasViewContext)
export const useCanvasTransform = () => React.useContext(CanvasTransformContext)
export const useScaleAdapter = () => {
  const transform = useCanvasTransform()
  const scale = (transform.k / transform.globalK) * 1e5
  return (size: number) => size / scale
}
