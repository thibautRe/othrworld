import { styled } from '@othrworld/stitches-config'
import React from 'react'

import {
  useCanvasTransform,
  useCanvasTransformRef,
} from '../../stores/canvasTransform'
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

const useMesureInfo = () => {
  const [mesureInfo, setMesureInfo] = React.useState<MesureInfo | null>(null)
  React.useEffect(() => {
    const list = (e: KeyboardEvent) =>
      e.key === 'Control' && setMesureInfo(null)
    window.addEventListener('keyup', list)
    return () => window.removeEventListener('keyup', list)
  }, [])

  const onMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!e.ctrlKey) return
    setMesureInfo((mi) => {
      const currentPoint = { x: e.clientX, y: e.clientY }
      if (!mi) return { from: currentPoint, to: currentPoint }
      else return { ...mi, to: currentPoint }
    })
  }, [])

  return {
    mesureInfo,
    eventHandlers: { onMouseMove },
  }
}

export const SvgRoot: React.FC = ({ children }) => {
  const svgRef = useCanvasTransformRef<SVGSVGElement>()
  const { x, y, k } = useCanvasTransform()
  const { mesureInfo, eventHandlers } = useMesureInfo()

  return (
    <SVG ref={svgRef} id="canvas" {...eventHandlers}>
      <SVGView
        center={{ x, y }}
        scale={k}
        hideOnMinZoom={false}
        hideOnFar={false}
      >
        {children}
      </SVGView>
      {mesureInfo && <SVGMesure info={mesureInfo} />}
    </SVG>
  )
}
