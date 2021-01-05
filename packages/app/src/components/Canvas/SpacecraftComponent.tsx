import React from 'react'
import { Spacecraft } from '@othrworld/core'
import { styled } from '@othrworld/stitches-config'
import {
  getCarthesianCoords,
  getNextApoapsisPassage,
  getSpeedVector,
  recalculateOrbitForPosAndSpeed,
} from '@othrworld/orbital-mechanics'

import { useCanvasTransform } from '../../providers/CanvasViewProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'
import { OrbitComponent } from './OrbitComponent'
import { useDateContext } from '../../providers/DateProvider'
import { useKeyListener } from '../../hooks/useKeyListener'
import { useSystemStore } from '../../stores/system'

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

  const { currentDateRef, registerDateAction } = useDateContext()

  useKeyListener(
    'u',
    React.useCallback(() => {
      const runOrbitChangePhase1 = () => {
        const systemStore = useSystemStore.getState()
        const s = systemStore.system.spacecrafts.find(
          ({ id }) => id === spacecraft.id
        )!

        const currentS = getSpeedVector(s.orbit, currentDateRef.current)
        const orbit = recalculateOrbitForPosAndSpeed(
          s.orbit,
          getCarthesianCoords(s.orbit, currentDateRef.current),
          { x: currentS.x * 1.0005, y: currentS.y * 1.0005 },
          currentDateRef.current
        )

        if (orbit.a < 50000) {
          registerDateAction(
            new Date(currentDateRef.current.getTime() + 1000),
            runOrbitChangePhase1
          )
        } else {
          registerDateAction(
            getNextApoapsisPassage(s.orbit, currentDateRef.current),
            runOrbitChangePhase2
          )
        }

        systemStore.setSpacecraft(spacecraft.id, { ...s, orbit })
      }

      const runOrbitChangePhase2 = () => {
        const systemStore = useSystemStore.getState()
        const s = systemStore.system.spacecrafts.find(
          ({ id }) => id === spacecraft.id
        )!

        const currentS = getSpeedVector(s.orbit, currentDateRef.current)
        const orbit = recalculateOrbitForPosAndSpeed(
          s.orbit,
          getCarthesianCoords(s.orbit, currentDateRef.current),
          { x: currentS.x * 1.0005, y: currentS.y * 1.0005 },
          currentDateRef.current
        )

        if (orbit.e > 0.05) {
          registerDateAction(
            new Date(currentDateRef.current.getTime() + 1000),
            runOrbitChangePhase2
          )
        }
        systemStore.setSpacecraft(spacecraft.id, { ...s, orbit })
      }

      registerDateAction(
        new Date(currentDateRef.current.getTime() + 40000),
        runOrbitChangePhase1
      )
    }, [registerDateAction, currentDateRef, spacecraft.id])
  )

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
