import React from 'react'

import { SvgRoot } from './components/Canvas/SvgRoot'
import { SystemComponent } from './components/Canvas/SystemComponent'

export const App = () => {
  return (
    <SvgRoot>
      <SystemComponent />
    </SvgRoot>
  )
}
