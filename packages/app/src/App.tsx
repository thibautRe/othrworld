import React from 'react'
import { css } from '@othrworld/stitches-config'
import {
  generateDebugSystem,
  generateSolarSystem,
  generateSystem,
} from '@othrworld/systemgen'
import { System } from '@othrworld/core'

import { SvgRoot } from './components/Canvas/SvgRoot'
import { SystemComponent } from './components/Canvas/SystemComponent'
import { StatusBarComponent } from './components/StatusBarComponent'
import { CanvasTooltips } from './components/CanvasTooltips'
import { useKeyListener } from './hooks/useKeyListener'
import { useDateContext } from './providers/DateProvider'
import { useSystemStore } from './stores/system'

css.global({
  body: {
    fontFamily: '$sansSerif',
  },
})

export const App = () => {
  const { resetCurrentDate } = useDateContext()

  const resetSystem = React.useCallback(
    (system: System) => {
      useSystemStore.getState().setSystem(system)
      resetCurrentDate()
    },
    [resetCurrentDate]
  )

  useKeyListener(
    'r',
    React.useCallback(() => void resetSystem(generateSystem()), [resetSystem])
  )
  useKeyListener(
    'd',
    React.useCallback(() => void resetSystem(generateDebugSystem()), [
      resetSystem,
    ])
  )
  useKeyListener(
    's',
    React.useCallback(() => void resetSystem(generateSolarSystem()), [
      resetSystem,
    ])
  )
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
