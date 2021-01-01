import { styled } from '@othrworld/stitches-config'
import React from 'react'

import { useCanvasView } from '../../providers/CanvasViewProvider'
import { SVGView } from './SVGView'

const SVG = styled.svg({
  display: 'block',
  width: '100%',
  height: '100%',
  fill: 'none',
  userSelect: 'none',
  fontFamily: 'inherit',

  '& g': {
    outline: 'none',
  },
})

export const SvgRoot: React.FC = ({ children }) => {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const { applyZoomEvents } = useCanvasView()

  React.useEffect(() => {
    if (!svgRef.current) return
    applyZoomEvents(svgRef.current)
  }, [applyZoomEvents])

  return (
    <SVG ref={svgRef} id="canvas">
      <SVGView hideOnMinZoom={false}>{children}</SVGView>
    </SVG>
  )
}
