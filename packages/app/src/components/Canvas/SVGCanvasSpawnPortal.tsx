import React from 'react'
import ReactDOM from 'react-dom'

export const SVGCanvasSpawnPortal: React.FC = ({ children }) => {
  const [el, setEl] = React.useState<SVGGElement | null>(null)

  React.useEffect(() => {
    const e = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const canvas = document.querySelector('#canvas')

    canvas?.appendChild(e)
    setEl(e)
    return () => void canvas?.removeChild(e)
  }, [])

  if (!el) return null
  return ReactDOM.createPortal(children, el)
}
