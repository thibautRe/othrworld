import create from 'zustand'
import React from 'react'
import { zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom'
import { select, Selection } from 'd3-selection'
import shallow from 'zustand/shallow'
import { Body, ID, Spacecraft } from '@othrworld/core'

import { useDateStore } from './date'
import { getAbsoluteCoords, useSystemStore } from './system'
import { GLOBAL_SCALE_MULTIPLIER } from '../components/Canvas/SVGView'

type SVGSelection = Selection<Element, unknown, null, undefined>
interface CanvasTransform {
  x: number
  y: number
  k: number
}
type CanvasTransformState = {
  x: number
  y: number
  k: number
  zoomBehaviour: ZoomBehavior<Element, unknown>
  selection: SVGSelection | null

  setTransform: (transform: CanvasTransform) => void
  applyZoomEvents: (elt: Element) => void

  targetId: ID<'body'> | ID<'spacecraft'> | null
  targetFollowSubscribtion?: () => void
  setTarget: (target: Body | Spacecraft) => void
  clearTarget: () => void
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
    zoomBehaviour: zoom<Element, unknown>()
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

    targetId: null,
    clearTarget: () => {
      const { targetFollowSubscribtion } = get()
      if (targetFollowSubscribtion) {
        targetFollowSubscribtion()
      }
      set({ targetId: null, targetFollowSubscribtion: undefined })
    },
    setTarget: (targetProp) => {
      const { targetFollowSubscribtion } = get()
      if (targetFollowSubscribtion) {
        targetFollowSubscribtion()
      }
      const setTransform = (t: Date) => {
        const sysStore = useSystemStore.getState()
        const target =
          targetProp.type === 'spacecraft'
            ? sysStore.getSpacecraft(targetProp.id)
            : sysStore.getBody(targetProp.id)
        if (!target || target.type === 'star') return

        const { x, y } = getAbsoluteCoords(target.orbit, t)
        get().setTransform({
          x: -x / GLOBAL_SCALE_MULTIPLIER,
          y: -y / GLOBAL_SCALE_MULTIPLIER,
          k: get().k,
        })
      }

      setTransform(useDateStore.getState().currentDate)

      set({
        targetId: targetProp.id,
        targetFollowSubscribtion: useDateStore.subscribe(
          setTransform,
          (s) => s.currentDate
        ),
      })
    },
  })
)

const transformExtractor = ({ x, y, k }: CanvasTransformState) => ({ x, y, k })
export const useCanvasTransform = () =>
  useCanvasTransformStore(transformExtractor, shallow)

const zoomExtractor = ({ k }: CanvasTransformState) => k
export const useCanvasTransformZoom = () =>
  useCanvasTransformStore(zoomExtractor)

const targetIdExtractor = ({ targetId }: CanvasTransformState) => targetId
export const useCanvasTransformTargetId = () =>
  useCanvasTransformStore(targetIdExtractor)

const applierSelector = ({ applyZoomEvents }: CanvasTransformState) =>
  applyZoomEvents
export const useCanvasTransformRef = <TElement extends Element>() => {
  const ref = React.useRef<TElement>(null)
  const apply = useCanvasTransformStore(applierSelector)
  React.useEffect(() => {
    console.log(ref.current)

    if (!ref.current) return
    apply(ref.current)
  }, [apply])

  return ref
}
