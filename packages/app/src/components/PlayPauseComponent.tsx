import React from 'react'
import { styled } from '@othrworld/stitches-config'

import { usePlayPause } from '../providers/SystemProvider'

const Wrapper = styled.div({
  position: 'absolute',
  bottom: 0,
  right: 0,
  left: 0,
  padding: '$1',
  textAlign: 'center',
  background: '$pauseBanner',
  color: 'white',
})

export const PlayPauseComponent = () => {
  const isPlay = usePlayPause()

  if (isPlay) return null

  return <Wrapper>Paused</Wrapper>
}
