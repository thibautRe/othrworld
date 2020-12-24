import React from 'react'

import { useCanvasView } from '../../providers/CanvasViewProvider'

export const SvgRoot: React.FC = ({ children }) => {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const { transform, applyZoomEvents } = useCanvasView()

  React.useEffect(() => {
    if (!svgRef.current) return
    applyZoomEvents(svgRef.current)
  }, [applyZoomEvents])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <g
        transform={`
          translate(${transform.x} ${transform.y})
          scale(${transform.k})
        `}
      >
        <g style={{ transform: 'translate(50%, 50%)' }}>{children}</g>
      </g>
    </svg>
  )
}
