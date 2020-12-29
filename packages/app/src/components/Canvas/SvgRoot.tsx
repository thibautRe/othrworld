import { styled } from '@othrworld/stitches-config'
import React from 'react'

import { useCanvasView } from '../../providers/CanvasViewProvider'

const SVG = styled.svg({
  display: 'block',
  width: '100%',
  height: '100%',
  fill: 'none',
  userSelect: 'none',
  fontFamily: 'inherit',
})
const CenterG = styled.g({
  transform: 'translate(50%,50%)',
})

export const SvgRoot: React.FC = ({ children }) => {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const { transform, applyZoomEvents } = useCanvasView()

  React.useEffect(() => {
    if (!svgRef.current) return
    applyZoomEvents(svgRef.current)
  }, [applyZoomEvents])

  return (
    <SVG ref={svgRef}>
      <g
        transform={`
          translate(${transform.x} ${transform.y})
          scale(${transform.k})
        `}
      >
        <CenterG>{children}</CenterG>
      </g>
    </SVG>
  )
}
