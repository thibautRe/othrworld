import React from 'react'
import { styled } from '@othrworld/stitches-config'
import { useCanvasTransform } from '../../providers/CanvasViewProvider'

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
  const { k } = useCanvasTransform()
  return (
    <>
      <Sol r={radius} />
      <SolIcon r={10 / k} />
    </>
  )
}
