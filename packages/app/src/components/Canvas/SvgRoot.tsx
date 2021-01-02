import { styled } from '@othrworld/stitches-config'
import React from 'react'

import { useCanvasView } from '../../providers/CanvasViewProvider'
import { MesureInfo, SVGMesure } from './SVGMesure'
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
  const [mesureInfo, setMesureInfo] = React.useState<MesureInfo | null>(null)

  React.useEffect(() => {
    if (!svgRef.current) return
    applyZoomEvents(svgRef.current)
  }, [applyZoomEvents])

  return (
    <SVG
      ref={svgRef}
      id="canvas"
      onMouseMove={(e) => {
        if (!e.ctrlKey) return setMesureInfo(null)
        setMesureInfo((mi) => {
          const currentPoint = { x: e.clientX, y: e.clientY }
          if (!mi) return { from: currentPoint, to: currentPoint }
          else return { ...mi, to: currentPoint }
        })
      }}
    >
      <SVGView hideOnMinZoom={false}>{children}</SVGView>
      {mesureInfo && <SVGMesure info={mesureInfo} />}
    </SVG>
  )
}
