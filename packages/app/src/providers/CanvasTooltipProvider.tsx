import React from 'react'
import { Planet, Spacecraft } from '@othrworld/core'

interface BaseCanvasTooltip {
  position: { x: number; y: number }
}
interface PlanetCanvasTooltip {
  type: 'planet'
  planet: Planet
}
interface SpacecraftCanvasTooltip {
  type: 'spacecraft'
  spacecraft: Spacecraft
}

type CanvasTooltip = PlanetCanvasTooltip | SpacecraftCanvasTooltip

type CanvasTooltipInContext = (CanvasTooltip & BaseCanvasTooltip) | null
interface CanvasTooltipContext {
  canvasTooltip: CanvasTooltipInContext
  onOpenCanvasTooltip: (e: React.MouseEvent, tooltip: CanvasTooltip) => void
  onCloseCanvasTooltip: () => void
}

const CanvasTooltipContext = React.createContext<CanvasTooltipContext>({
  canvasTooltip: null,
  onOpenCanvasTooltip: () => {
    throw new Error('No CanvasTooltipProvider found')
  },
  onCloseCanvasTooltip: () => {
    throw new Error('No CanvasTooltipProvider found')
  },
})

export const CanvasTooltipProvider: React.FC = ({ children }) => {
  const [
    canvasTooltip,
    setCanvasTooltip,
  ] = React.useState<CanvasTooltipInContext>(null)

  const onOpenCanvasTooltip = React.useCallback(
    (e: React.MouseEvent, tooltip: CanvasTooltip) => {
      setCanvasTooltip({ position: { x: e.clientX, y: e.clientY }, ...tooltip })
    },
    []
  )
  const onCloseCanvasTooltip = React.useCallback(
    () => setCanvasTooltip(null),
    []
  )

  return (
    <CanvasTooltipContext.Provider
      value={{ canvasTooltip, onOpenCanvasTooltip, onCloseCanvasTooltip }}
    >
      {children}
    </CanvasTooltipContext.Provider>
  )
}

export const useCanvasTooltips = () => React.useContext(CanvasTooltipContext)
