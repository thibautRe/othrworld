import create from 'zustand'
import { zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom'
import { select, Selection } from 'd3-selection'
import shallow from 'zustand/shallow'

type SVGSelection = Selection<SVGSVGElement, unknown, null, undefined>
interface CanvasTransform {
  x: number
  y: number
  k: number
}
type CanvasTransformState = {
  x: number
  y: number
  k: number
  globalK: number
  zoomBehaviour: ZoomBehavior<SVGSVGElement, unknown>
  selection: SVGSelection | null

  setTransform: (transform: CanvasTransform) => void
  applyZoomEvents: (elt: SVGSVGElement) => void
}

export const useCanvasTransformStore = create<CanvasTransformState>(
  (set, get) => ({
    x: 0,
    y: 0,
    k: 1,
    globalK: 1,
    zoomBehaviour: zoom<SVGSVGElement, unknown>()
      .filter((e) => !e.ctrlKey)
      .on('zoom', ({ transform: { x, y, k } }) => set({ x, y, k, globalK: k })),
    selection: null,
    setTransform: ({ x, y, k }) => {
      const { selection, zoomBehaviour } = get()
      if (!selection) return
      selection.call(
        zoomBehaviour.transform,
        zoomIdentity.translate(x, y).scale(k)
      )
    },
    applyZoomEvents: (elt) =>
      set({ selection: select(elt).call(get().zoomBehaviour) }),
  })
)

const transformExtracter = ({ x, y, k }: CanvasTransformState) => ({ x, y, k })

export const useCanvasTransform = () =>
  useCanvasTransformStore(transformExtracter, shallow)
