import { Orbit } from '@othrworld/core'
import { getCarthesianCoords } from '@othrworld/orbital-mechanics'
import { useCurrentDate } from '../../providers/DateProvider'
import { adaptDistanceToSVG } from '../../utils/distanceAdapter'

/** Translation group for an orbit */
export const OrbitItem: React.FC<{ orbit?: Orbit }> = ({ orbit, children }) => {
  const date = useCurrentDate()
  if (!orbit) return <>{children}</>

  const { x, y } = getCarthesianCoords(orbit, date)

  // prettier-ignore
  return <g transform={`translate(${adaptDistanceToSVG(x)} ${adaptDistanceToSVG(y)})`}>{children}</g>
}
