import React from 'react'
import { Spacecraft } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'
import {
  getCarthesianCoords,
  getSpeedVector,
  recalculateOrbitForPosAndSpeed,
} from '@othrworld/orbital-mechanics'

import { useCanvasTransform } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'
import { OrbitComponent } from './OrbitComponent'
import { useSystemContext } from '../../providers/SystemProvider'
import { useDateContext } from '../../providers/DateProvider'

const SpacecraftDot = styled.circle({
  fill: 'white',
})
const Text = styled.text({
  fill: 'white',
  textAnchor: 'middle',
  transition: 'opacity 200ms',
})

interface SpacecraftComponentProps {
  spacecraft: Spacecraft
}
export const SpacecraftComponent = ({
  spacecraft,
}: SpacecraftComponentProps) => {
  const { k } = useCanvasTransform()
  const adapter = useScaleAdapter()
  const fontSize = 10 / k
  const visualRadius = adapter(spacecraft.orbit.a) * k

  const textOpacity = visualRadius > 50 ? 1 : 0
  const ellipseOpacity = visualRadius > 20 ? 1 : 0

  const orbitStrokeDash = adapter(spacecraft.orbit.a) / 30

  const { setSpacecraft } = useSystemContext()
  const { currentDateRef } = useDateContext()

  React.useEffect(() => {
    const list = (e: KeyboardEvent) => {
      let fac = 0
      if (e.key === 'i') {
        fac = 1.01
      } else if (e.key === 'k') {
        fac = 0.99
      } else if (e.key === 'o') {
        fac = 1
      }
      if (fac !== 0) {
        setSpacecraft(spacecraft.id, (s) => {
          const currentS = getSpeedVector(s.orbit, currentDateRef.current)
          return {
            ...s,
            orbit: recalculateOrbitForPosAndSpeed(
              s.orbit,
              getCarthesianCoords(s.orbit, currentDateRef.current),
              { x: currentS.x * fac, y: currentS.y * fac },
              currentDateRef.current
            ),
          }
        })
      }
    }
    window.addEventListener('keydown', list)
    return () => window.removeEventListener('keydown', list)
  }, [setSpacecraft, spacecraft.id, currentDateRef])

  return (
    <OrbitComponent
      orbit={spacecraft.orbit}
      OrbitEllipseProps={{
        style: {
          strokeDasharray: `${orbitStrokeDash} ${orbitStrokeDash}`,
          opacity: ellipseOpacity,
        },
      }}
    >
      <SpacecraftDot r={2 / k} />
      <Text y={fontSize} fontSize={fontSize} style={{ opacity: textOpacity }}>
        {spacecraft.name}
      </Text>
    </OrbitComponent>
  )
}
