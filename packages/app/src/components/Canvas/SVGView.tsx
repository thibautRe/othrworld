import React from 'react'

import {
  CanvasTransformProvider,
  useCanvasTransform,
} from '../../providers/CanvasViewProvider'
import { SVGScaleProvider } from '../../providers/SVGScaleProvider'

interface SVGViewProps {
  center?: { x: number; y: number }
  scale?: number
  /** If the view should hide its content on low zoom levels (global view) */
  hideOnMinZoom?: boolean
}
export const SVGView: React.FC<SVGViewProps> = ({
  center = { x: 0, y: 0 },
  scale = 1,
  hideOnMinZoom = true,
  children,
}) => {
  const transform = useCanvasTransform()
  const tx = transform.x + center.x * transform.k
  const ty = transform.y + center.y * transform.k
  const s = transform.k * scale

  // FIXME: the `scale!==1` is a hack in order to allow the top-level system pass to
  // draw orbits that are far away from the center when being zoomed in.
  // Potentially, a kind of "bounding box" calculation is needed in order to fix some
  // edge cases
  const shouldHide =
    (hideOnMinZoom && s < 0.01) ||
    s > 200 ||
    (scale !== 1 && (Math.abs(tx) > 1e8 || Math.abs(ty) > 1e8))

  return (
    <g
      transform={`translate(${tx} ${ty}) scale(${s})`}
      style={{ display: shouldHide ? 'none' : 'initial' }}
      data-dbg-s={s}
      data-dbg-scale={scale}
      data-dbg-k={transform.k}
      data-dbg-tx={tx}
      data-dbg-ty={ty}
    >
      <CanvasTransformProvider transform={{ x: tx, y: ty, k: s }}>
        <SVGScaleProvider unit={scale * 1e5}>{children}</SVGScaleProvider>
      </CanvasTransformProvider>
    </g>
  )
}
