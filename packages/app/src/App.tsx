import React from 'react'

import { SvgRoot } from './components/Canvas/SvgRoot'
import { SystemComponent } from './components/Canvas/SystemComponent'
import { PlayPauseComponent } from './components/PlayPauseComponent'

export const App = () => {
  return (
    <>
      <SvgRoot>
        <SystemComponent />
      </SvgRoot>
      <PlayPauseComponent />
    </>
  )
}
