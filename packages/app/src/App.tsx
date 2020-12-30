import React from 'react'
import { styled } from '@othrworld/stitches-config'

import { SvgRoot } from './components/Canvas/SvgRoot'
import { SystemComponent } from './components/Canvas/SystemComponent'
import { StatusBarComponent } from './components/StatusBarComponent'

const AppRoot = styled.div({
  fontFamily: '$sansSerif',
  height: '100%',
})

export const App = () => {
  return (
    <AppRoot>
      <SvgRoot>
        <SystemComponent />
      </SvgRoot>
      <StatusBarComponent />
    </AppRoot>
  )
}
