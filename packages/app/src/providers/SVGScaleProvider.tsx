import React from 'react'

type SVGScaleContext = (distance: number) => number
const SVGScaleContext = React.createContext<SVGScaleContext>(() => {
  throw new Error('No SVGScaleProvider found')
})

interface SVGScaleProviderProps {
  /** This represents the scale at which things should be drawn: 1px in the SVG equals that unit */
  unit: number
}

/**
 * @fixme consider merging this with CanvasTransform Provider and context
 * because they are only used together
 * 
 * @deprecated
 */
export const SVGScaleProvider: React.FC<SVGScaleProviderProps> = ({
  children,
  unit,
}) => {
  const adapter = React.useCallback((distance: number) => distance / unit, [
    unit,
  ])
  return (
    <SVGScaleContext.Provider value={adapter}>
      {children}
    </SVGScaleContext.Provider>
  )
}

export const useScaleAdapter = () => React.useContext(SVGScaleContext)
