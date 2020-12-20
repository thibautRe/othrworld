import React from 'react'
import { select } from 'd3-selection'

import { useCanvasView } from '../../providers/CanvasViewProvider'

export const SvgRoot: React.FC = ({ children }) => {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const { transform, zoomBehaviour } = useCanvasView()

  React.useEffect(() => {
    if (!svgRef.current) return
    select(svgRef.current).call(zoomBehaviour)
  }, [zoomBehaviour])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <g
        style={{
          transform: `
        translate3d(${transform.x}px, ${transform.y}px, 0px)
        scale3d(${transform.k}, ${transform.k}, 1)
      `,
        }}
      >
        {children}
      </g>
    </svg>
  )
}
