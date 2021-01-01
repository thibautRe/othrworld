import { styled } from '@othrworld/stitches-config'
import React from 'react'
import { useEscKeyHandler } from '../hooks/useEscKeyHandler'

import { SpawnPortal } from './SpawnPortal'

const PopoverContainer = styled.div({
  position: 'absolute',
  backgroundColor: '$grey20',
  color: 'white',
  fontSize: 12,
  px: '$2',
  py: '$1',
})

interface PopoverProps {
  position: { x: number; y: number }
  onClose: () => void
}

export const Popover: React.FC<PopoverProps> = ({
  position,
  onClose,
  children,
  ...props
}) => {
  useEscKeyHandler(onClose)
  return (
    <SpawnPortal>
      <PopoverContainer style={{ top: position.y, left: position.x }}>
        {children}
      </PopoverContainer>
    </SpawnPortal>
  )
}
