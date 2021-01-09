import React from 'react'

import { useCanvasTransformZoom } from '../../stores/canvasTransform'

interface ViewContext {
  x: number
  y: number
  k: number
}
const ViewContext = React.createContext<ViewContext>({ x: 0, y: 0, k: 1 })
const useViewContext = () => React.useContext(ViewContext)

interface SVGViewProps {
  center: { x: number; y: number }
  scale: number
  /** If the view should hide its content on low zoom levels (global view) */
  hideOnMinZoom?: boolean
  /** If the view should hide its content on high lateral transforms */
  hideOnFar?: boolean
}

export const SVGView: React.FC<SVGViewProps> = ({
  center,
  scale,
  hideOnMinZoom = true,
  hideOnFar = true,
  children,
}) => {
  const viewContext = useViewContext()
  const tx = viewContext.x + center.x * viewContext.k
  const ty = viewContext.y + center.y * viewContext.k
  const s = viewContext.k * scale

  const shouldHide =
    (hideOnMinZoom && s < 1e-3) ||
    s > 200 ||
    // FIXME: this is a hack in order to allow the top-level system pass to
    // draw orbits that are far away from the center when being zoomed in.
    // Potentially, a kind of "bounding box" calculation is needed in order to fix some
    // edge cases
    (hideOnFar && (Math.abs(tx) > 1e8 || Math.abs(ty) > 1e8))

  return (
    <g
      transform={`translate(${tx} ${ty}) scale(${s})`}
      style={{ display: shouldHide ? 'none' : 'initial' }}
    >
      <ViewContext.Provider value={{ x: tx, y: ty, k: s }}>
        {children}
      </ViewContext.Provider>
    </g>
  )
}

export const GLOBAL_SCALE_MULTIPLIER = 1e5

/** Returns a helper function to call when trying to draw to-scale values (distances, radius, ...) */
export const useToScaleAdapter = () => {
  const { k } = useViewContext()
  const globalK = useCanvasTransformZoom()
  const scale = (k / globalK) * GLOBAL_SCALE_MULTIPLIER
  return (distance: number) => distance / scale
}

export const useFixedSizeAdapter = () => {
  const { k } = useViewContext()
  return (size: number) => size / k
}
