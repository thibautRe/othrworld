import React from 'react'
import { css } from '@othrworld/stitches-config'

import { SvgRoot } from './components/Canvas/SvgRoot'
import { SystemComponent } from './components/Canvas/SystemComponent'
import { StatusBarComponent } from './components/StatusBarComponent'
import { CanvasTooltips } from './components/CanvasTooltips'

css.global({
  body: {
    fontFamily: '$sansSerif',
  },
})

export const App = () => {
  return (
    <>
      <SvgRoot>
        <SystemComponent />
      </SvgRoot>
      <CanvasTooltips />
      <StatusBarComponent />
    </>
  )
}
