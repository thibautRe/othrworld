import React from 'react'
import ReactDOM from 'react-dom'

export const SpawnPortal: React.FC = ({ children }) => {
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.setAttribute('data-type', 'spawn-portal')
    setPortalEl(el)
    return () => void document.body.removeChild(el)
  }, [])

  return portalEl ? ReactDOM.createPortal(children, portalEl) : null
}
