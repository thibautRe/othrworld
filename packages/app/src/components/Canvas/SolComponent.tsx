import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { useCanvasView } from '../../providers/CanvasViewProvider'

const Sol = styled.circle({
  fill: '$sol',
})
const SolIcon = styled.circle({
  fill: '$sol',
  opacity: 0.4,
})

interface SolComponentProps {
  radius: number
}
export const SolComponent = ({ radius }: SolComponentProps) => {
  const { transform } = useCanvasView()
  const { k } = transform
  return (
    <>
      <Sol r={radius} />
      <SolIcon r={10 / k} />
    </>
  )
}
