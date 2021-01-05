import React from 'react'
import shallow from 'zustand/shallow'
import { styled } from '@othrworld/stitches-config'

import { useCanvasTransform } from '../providers/CanvasViewProvider'
import { useSystemStore } from '../stores/system'
import { useDateStore } from '../stores/date'

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
  const { k } = useCanvasTransform()

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
      x) {isPaused && '*PAUSED*'}
      <span>Zoom: {k.toFixed(4)}</span>
    </Wrapper>
  )
}
