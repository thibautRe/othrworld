import React from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrthographicCamera } from 'three'

import {
  useCanvasTransform,
  useCanvasTransformRef,
} from '../../stores/canvasTransform'
import { SystemComponentThree } from './SystemComponentThree'

const CanvasContainer: React.FC = ({ children }) => {
  const ref = useCanvasTransformRef<HTMLDivElement>()
  return (
    <div ref={ref} style={{ height: '100%' }}>
      <Canvas>
        <CanvasCamera />
        {children}
      </Canvas>
    </div>
  )
}

const CanvasCamera = () => {
  const { setDefaultCamera, camera, size } = useThree()
  const { x, y, k } = useCanvasTransform()
  const cameraRef = React.useRef<OrthographicCamera>(null)

  useFrame(() => {
    if (!cameraRef.current) return
    cameraRef.current.updateProjectionMatrix()
  })

  React.useLayoutEffect(() => {
    if (!cameraRef.current) return
    const oldCam = camera
    setDefaultCamera(cameraRef.current)
    return () => setDefaultCamera(oldCam)
    // `camera` is missing on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDefaultCamera])

  return (
    <orthographicCamera
      ref={cameraRef}
      left={size.width / -2}
      right={size.width / 2}
      top={size.height / 2}
      bottom={size.height / -2}
      position={[-(x - size.width / 2) / k, (y - size.height / 2) / k, 6]}
      zoom={k}
    />
  )
}

const Box = ({ sizeMult = 1 }) => (
  <mesh>
    <boxGeometry args={[1 * sizeMult, 1 * sizeMult, 0.1]} />
    <meshBasicMaterial color="orange" opacity={0.2} transparent />
  </mesh>
)

export const CanvasThree = () => {
  return (
    <CanvasContainer>
      <SystemComponentThree />
      <Box sizeMult={0.0001} />
      <Box sizeMult={0.01} />
      <Box sizeMult={1} />
      <Box sizeMult={100} />
      <Box sizeMult={10000} />
    </CanvasContainer>
  )
}
