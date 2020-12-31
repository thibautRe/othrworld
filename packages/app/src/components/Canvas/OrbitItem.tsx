import { Orbit } from '@othrworld/core'
import { getCarthesianCoords } from '@othrworld/orbital-mechanics'

import { useCurrentDate } from '../../providers/DateProvider'
import { useScaleAdapter } from '../../providers/SVGScaleProvider'

/** Translation group for an orbit */
export const OrbitItem: React.FC<{ orbit?: Orbit }> = ({ orbit, children }) => {
  const date = useCurrentDate()
  const adapter = useScaleAdapter()
  if (!orbit) return <>{children}</>

  const { x, y } = getCarthesianCoords(orbit, date)

  // prettier-ignore
  return <g transform={`translate(${adapter(x)} ${adapter(y)})`}>{children}</g>
}
