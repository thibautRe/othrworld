import React from 'react'
import { styled } from '@othrworld/stitches-config'

import {
  useCurrentDate,
  useCurrentTimeMult,
  usePlayPause,
} from '../providers/DateProvider'
import { useSystem } from '../providers/SystemProvider'
import { useCanvasTransform } from '../providers/CanvasViewProvider'

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
  const system = useSystem()
  const isPlay = usePlayPause()
  const currentDate = useCurrentDate()
  const currentTimeMult = useCurrentTimeMult()
  const { k } = useCanvasTransform()

  return (
    <Wrapper>
      <span>
        Planets: <strong>{system.planets.length}</strong>
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
