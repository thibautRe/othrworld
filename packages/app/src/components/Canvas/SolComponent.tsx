import React from 'react'
import { styled } from '@othrworld/stitches-config'

const Sol = styled.circle({
  fill: '$sol',
})

interface SolComponentProps {
  radius: number
}
export const SolComponent = ({ radius }: SolComponentProps) => (
  <Sol r={radius} />
)
