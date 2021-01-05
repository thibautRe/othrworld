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
import { useSystemStore } from './stores/system'
import { useDateStore, useIsPaused } from './stores/date'
import { useFrame } from './hooks/useFrame'

css.global({
  body: {
    fontFamily: '$sansSerif',
  },
})

export const App = () => {
  const resetSystem = React.useCallback((system: System) => {
    useSystemStore.getState().setSystem(system)
    useDateStore.getState().resetCurrentDate()
  }, [])

  useKeyListener(
    'r',
    React.useCallback(() => resetSystem(generateSystem()), [resetSystem])
  )
  useKeyListener(
    'd',
    React.useCallback(() => resetSystem(generateDebugSystem()), [resetSystem])
  )
  useKeyListener(
    's',
    React.useCallback(() => resetSystem(generateSolarSystem()), [resetSystem])
  )
  useKeyListener(
    ' ',
    React.useCallback(() => useDateStore.getState().toggleIsPaused(), [])
  )
  useKeyListener(
    '+',
    React.useCallback(
      () => useDateStore.setState((s) => ({ timeMult: s.timeMult * 2 })),
      []
    )
  )
  useKeyListener(
    '-',
    React.useCallback(
      () => useDateStore.setState((s) => ({ timeMult: s.timeMult / 2 })),
      []
    )
  )

  const isPaused = useIsPaused()
  useFrame(!isPaused ? useDateStore.getState().runFrame : null)
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
