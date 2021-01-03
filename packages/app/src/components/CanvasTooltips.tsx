import React from 'react'
import { getSpeed } from '@othrworld/orbital-mechanics'

import { useCanvasTooltips } from '../providers/CanvasTooltipProvider'
import { useCurrentDate } from '../providers/DateProvider'
import { Popover } from './Popover'

export const CanvasTooltips = () => {
  const { canvasTooltip, onCloseCanvasTooltip } = useCanvasTooltips()
  const currentDate = useCurrentDate()

  if (!canvasTooltip) return null

  return (
    <Popover position={canvasTooltip.position} onClose={onCloseCanvasTooltip}>
      {canvasTooltip.type}
      {canvasTooltip.type === 'planet' && (
        <>
          <div>
            Radius: <strong>{canvasTooltip.planet.radius.toFixed()}</strong>
          </div>
          <div>
            Speed:{' '}
            <strong>
              {getSpeed(canvasTooltip.planet.orbit, currentDate).toFixed(1)}km/s
            </strong>
          </div>
        </>
      )}
    </Popover>
  )
}
