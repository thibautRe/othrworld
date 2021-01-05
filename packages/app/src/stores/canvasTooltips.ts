import create from 'zustand'
import { Planet, Spacecraft } from '@othrworld/core'

interface BaseCanvasTooltip {
  position: { x: number; y: number }
}
interface PlanetCanvasTooltip {
  type: 'planet'
  id: Planet['id']
}
interface SpacecraftCanvasTooltip {
  type: 'spacecraft'
  id: Spacecraft['id']
}

type CanvasTooltip = PlanetCanvasTooltip | SpacecraftCanvasTooltip
type CanvasTooltipInContext = (CanvasTooltip & BaseCanvasTooltip) | null

type CanvasTooltipState = {
  canvasTooltip: CanvasTooltipInContext
  open: (e: React.MouseEvent, tooltip: CanvasTooltip) => void
  close: () => void
}

export const useCanvasTooltipStore = create<CanvasTooltipState>((set) => ({
  canvasTooltip: null,
  open: (e, tooltip) =>
    set({
      canvasTooltip: { position: { x: e.clientX, y: e.clientY }, ...tooltip },
    }),
  close: () => set({ canvasTooltip: null }),
}))

const canvasTooltipGetter = (s: CanvasTooltipState) => s.canvasTooltip
export const useCanvasTooltip = () => useCanvasTooltipStore(canvasTooltipGetter)
