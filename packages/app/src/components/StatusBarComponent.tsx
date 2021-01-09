import React from 'react'
import shallow from 'zustand/shallow'
import { styled } from '@othrworld/stitches-config'

import { useSystemStore } from '../stores/system'
import { useDateStore } from '../stores/date'
import {
  useCanvasTransformZoom,
  useCanvasTransformStore,
  useCanvasTransformTargetId,
} from '../stores/canvasTransform'

const Wrapper = styled.div({
  position: 'absolute',
  bottom: 0,
  right: 0,
  left: 0,
  padding: '$1',
  backgroundColor: '$grey50',
  color: 'white',
  fontFamily: 'monospace',
})

export const StatusBarComponent = () => {
  const system = useSystemStore(React.useCallback((s) => s.system, []))
  const [isPaused, currentDate, currentTimeMult] = useDateStore(
    React.useCallback((s) => [s.isPaused, s.currentDate, s.timeMult], []),
    shallow
  )
  const k = useCanvasTransformZoom()
  const targetId = useCanvasTransformTargetId()

  return (
    <Wrapper>
      <span>
        Bodies: <strong>{system.bodies.length}</strong>
      </span>{' '}
      <span>
        Spacecrafts: <strong>{system.spacecrafts.length}</strong>
      </span>
      {' - '}
      {currentDate.toLocaleString()} ({currentTimeMult}
      x) {isPaused && '*PAUSED*'} <span>Zoom: {k.toFixed(4)}</span>{' '}
      {targetId && (
        <>
          Following
          <button
            onClick={() => useCanvasTransformStore.getState().clearTarget()}
          >
            Unfollow
          </button>
        </>
      )}
    </Wrapper>
  )
}
