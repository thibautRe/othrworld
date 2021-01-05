import React from 'react'
import {
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
  getSpeed,
} from '@othrworld/orbital-mechanics'

import { useCanvasTooltips } from '../providers/CanvasTooltipProvider'
import { Popover } from './Popover'
import { useCurrentDate } from '../stores/date'
import { requestCircularOrbit } from '../actions/spacecraft/requestCircularOrbit'
import { Orbit, Planet, Spacecraft } from '@othrworld/core'
import { useSystemStore } from '../stores/system'

const CanvasTooltipOrbitInfo = ({ orbit }: { orbit: Orbit }) => {
  const currentDate = useCurrentDate()
  return (
    <>
      <div>
        Speed: <strong>{getSpeed(orbit, currentDate).toFixed(1)}km/s</strong>
      </div>
      <div>
        Next passage at periapsis:{' '}
        {getNextPeriapsisPassage(orbit, currentDate).toLocaleDateString()}
      </div>
      <div>
        Next passage at apoapsis:{' '}
        {getNextApoapsisPassage(orbit, currentDate).toLocaleDateString()}
      </div>
    </>
  )
}

const CanvasTooltipPlanet = ({ id }: { id: Planet['id'] }) => {
  const planet = useSystemStore(
    React.useCallback((s) => s.system.bodies.find((b) => b.id === id)!, [id])
  )

  return (
    <>
      <div>
        Radius: <strong>{planet.radius.toFixed()}</strong>
      </div>

      <CanvasTooltipOrbitInfo orbit={planet.orbit} />
    </>
  )
}

const CanvasTooltipSpacecraft = ({ id }: { id: Spacecraft['id'] }) => {
  const spacecraft = useSystemStore(
    React.useCallback((s) => s.system.spacecrafts.find((s) => s.id === id)!, [
      id,
    ])
  )

  return (
    <>
      <CanvasTooltipOrbitInfo orbit={spacecraft.orbit} />
      <button onClick={() => requestCircularOrbit(spacecraft.id, 50000)}>
        Request circular orbit
      </button>
    </>
  )
}

export const CanvasTooltips = () => {
  const { canvasTooltip, onCloseCanvasTooltip } = useCanvasTooltips()

  if (!canvasTooltip) return null

  return (
    <Popover position={canvasTooltip.position} onClose={onCloseCanvasTooltip}>
      {canvasTooltip.type}
      {canvasTooltip.type === 'planet' && (
        <CanvasTooltipPlanet id={canvasTooltip.id} />
      )}
      {canvasTooltip.type === 'spacecraft' && (
        <CanvasTooltipSpacecraft id={canvasTooltip.id} />
      )}
    </Popover>
  )
}
