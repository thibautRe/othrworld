import create from 'zustand'
import { zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom'
import { select, Selection } from 'd3-selection'
import shallow from 'zustand/shallow'
import { OrbitalElement } from '@othrworld/core'

import { useDateStore } from './date'
import { getAbsoluteCoords } from './system'
import { GLOBAL_SCALE_MULTIPLIER } from '../components/Canvas/SVGView'

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
  zoomBehaviour: ZoomBehavior<SVGSVGElement, unknown>
  selection: SVGSelection | null

  setTransform: (transform: CanvasTransform) => void
  applyZoomEvents: (elt: SVGSVGElement) => void

  target: OrbitalElement | null
  targetFollowSubscribtion?: () => void
  setTarget: (target: OrbitalElement | null) => void
}

const initView = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  k: 0.01,
}

export const useCanvasTransformStore = create<CanvasTransformState>(
  (set, get) => ({
    x: initView.x,
    y: initView.y,
    k: initView.k,
    zoomBehaviour: zoom<SVGSVGElement, unknown>()
      .filter((e) => !e.ctrlKey)
      .on('zoom', ({ transform: { x, y, k } }) => set({ x, y, k })),
    selection: null,
    setTransform: ({ x, y, k }) => {
      const { selection, zoomBehaviour } = get()
      if (!selection) return
      selection.call(
        zoomBehaviour.transform,
        zoomIdentity
          .translate(window.innerWidth / 2, window.innerHeight / 2)
          .scale(k)
          .translate(x, y)
      )
    },
    applyZoomEvents: (elt) => {
      const selection = select(elt).call(get().zoomBehaviour)
      selection.call(
        get().zoomBehaviour.transform,
        zoomIdentity.translate(initView.x, initView.y).scale(initView.k)
      )
      return set({ selection })
    },

    target: null,
    setTarget: (target) => {
      const { targetFollowSubscribtion } = get()
      if (targetFollowSubscribtion) {
        targetFollowSubscribtion()
      }
      if (!target) {
        set({ target, targetFollowSubscribtion: undefined })
      } else {
        set({
          target,
          targetFollowSubscribtion: useDateStore.subscribe(
            (currentDate: Date) => {
              const { x, y } = getAbsoluteCoords(target, currentDate)

              get().setTransform({
                x: -x / GLOBAL_SCALE_MULTIPLIER,
                y: -y / GLOBAL_SCALE_MULTIPLIER,
                k: get().k,
              })
            },
            (s) => s.currentDate
          ),
        })
      }
    },
  })
)

const transformExtractor = ({ x, y, k }: CanvasTransformState) => ({ x, y, k })
export const useCanvasTransform = () =>
  useCanvasTransformStore(transformExtractor, shallow)

const zoomExtractor = ({ k }: CanvasTransformState) => k
export const useCanvasTransformZoom = () =>
  useCanvasTransformStore(zoomExtractor)

const targetExtractor = ({ target }: CanvasTransformState) => target
export const useCanvasTransformTarget = () =>
  useCanvasTransformStore(targetExtractor)
