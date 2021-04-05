import { Distance } from '@othrworld/units'
import { useCanvasTransformZoom } from '../../stores/canvasTransform'

// Hook because it might depend on context later on
export const useToScaleAdapter = () => (size: Distance) => size * 1e-8

export const useFixedSizeAdapter = () => {
  const k = useCanvasTransformZoom()
  return (size: number) => size / k
}
