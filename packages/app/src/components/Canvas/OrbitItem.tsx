import { Orbit } from '@othrworld/core'
import { getCarthesianCoords } from '@othrworld/orbital-mechanics'

import { useCurrentDate } from '../../providers/DateProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'

/** Translation group for an orbit */
interface OrbitItemProps extends React.SVGAttributes<SVGGElement> {
  orbit: Orbit
}
export const OrbitItem: React.FC<OrbitItemProps> = ({
  orbit,
  children,
  ...props
}) => {
  const date = useCurrentDate()
  const adapter = useScaleAdapter()
  const { x, y } = getCarthesianCoords(orbit, date)

  return (
    <g transform={`translate(${adapter(x)} ${adapter(y)})`} {...props}>
      {children}
    </g>
  )
}
