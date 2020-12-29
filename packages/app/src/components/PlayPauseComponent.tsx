import React from 'react'
import { styled } from '@othrworld/stitches-config'
import {
  useCurrentDate,
  useCurrentTimeMult,
  usePlayPause,
} from '../providers/DateProvider'

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
  const currentDate = useCurrentDate()
  const currentTimeMult = useCurrentTimeMult()

  return (
    <Wrapper>
      {currentDate.toLocaleString()} (
      {isPlay ? `${currentTimeMult}x` : '*PAUSED*'})
    </Wrapper>
  )
}
