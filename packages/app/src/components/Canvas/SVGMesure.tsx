import React from 'react'
import { useCanvasTransformZoom } from '../../stores/canvasTransform'
import { GLOBAL_SCALE_MULTIPLIER } from './SVGView'

export interface MesureInfo {
  from: { x: number; y: number }
  to: { x: number; y: number }
}
interface SVGMesureProps {
  info: MesureInfo
}
export const SVGMesure = ({ info }: SVGMesureProps) => {
  const k = useCanvasTransformZoom()
  const dist = Math.sqrt(
    (info.to.x - info.from.x) ** 2 + (info.to.y - info.from.y) ** 2
  )
  return (
    <g data-dbg-item="mesure">
      <line
        x1={info.from.x}
        x2={info.to.x}
        y1={info.from.y}
        y2={info.to.y}
        stroke="white"
      />
      <text
        fontSize="10"
        fill="white"
        x={(info.from.x + info.to.x) / 2}
        y={(info.from.y + info.to.y) / 2}
      >
        {((dist / k) * GLOBAL_SCALE_MULTIPLIER).toFixed(0)}km
      </text>
    </g>
  )
}
