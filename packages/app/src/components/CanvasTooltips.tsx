import React from 'react'
import {
  getNextApoapsisPassage,
  getNextPeriapsisPassage,
  getSpeed,
} from '@othrworld/orbital-mechanics'
import { Body, Orbit, Planet, Spacecraft } from '@othrworld/core'

import { Popover } from './Popover'
import { useCurrentDate } from '../stores/date'
import { requestCircularOrbit } from '../actions/spacecraft/requestCircularOrbit'
import { useSystemStore } from '../stores/system'
import {
  useCanvasTooltip,
  useCanvasTooltipStore,
} from '../stores/canvasTooltips'
import { useCanvasTransformStore } from '../stores/canvasTransform'

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

const CanvasTooltipFollow = ({ item }: { item: Body | Spacecraft }) => (
  <button onClick={() => useCanvasTransformStore.getState().setTarget(item)}>
    Follow
  </button>
)

const CanvasTooltipPlanet = ({ id }: { id: Planet['id'] }) => {
  // @ts-expect-error this could break if this tooltip is being passed a Body that is not a planet
  const planet: Planet = useSystemStore(
    React.useCallback((s) => s.system.bodies.find((b) => b.id === id)!, [id])
  )

  return (
    <>
      <div>
        Radius: <strong>{planet.radius.toFixed()}</strong>
      </div>

      <CanvasTooltipOrbitInfo orbit={planet.orbit} />
      <CanvasTooltipFollow item={planet} />
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
      <CanvasTooltipFollow item={spacecraft} />
      <button onClick={() => requestCircularOrbit(spacecraft.id, 50000)}>
        Request circular orbit
      </button>
    </>
  )
}

export const CanvasTooltips = () => {
  const canvasTooltip = useCanvasTooltip()
  if (!canvasTooltip) return null

  return (
    <Popover
      position={canvasTooltip.position}
      onClose={useCanvasTooltipStore.getState().close}
    >
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
