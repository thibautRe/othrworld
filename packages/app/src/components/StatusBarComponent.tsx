import React from 'react'
import { styled } from '@othrworld/stitches-config'

import {
  useCurrentDate,
  useCurrentTimeMult,
  usePlayPause,
} from '../providers/DateProvider'
import { useCanvasTransform } from '../providers/CanvasViewProvider'
import { useSystemStore } from '../stores/system'

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
  const isPlay = usePlayPause()
  const currentDate = useCurrentDate()
  const currentTimeMult = useCurrentTimeMult()
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
      x) {!isPlay && '*PAUSED*'}
      <span>Zoom: {k.toFixed(4)}</span>
    </Wrapper>
  )
}
