import React from 'react'
import { useCanvasTooltips } from '../providers/CanvasTooltipProvider'
import { Popover } from './Popover'

const CanvasPlanetTooltip = ({planet}) => {

}

export const CanvasTooltips = () => {
  const { canvasTooltip, onCloseCanvasTooltip } = useCanvasTooltips()

  if (!canvasTooltip) return null

  return (
    <Popover position={canvasTooltip.position} onClose={onCloseCanvasTooltip}>
      {canvasTooltip.type}
    </Popover>
  )
}
