import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { CanvasTooltipProvider } from './providers/CanvasTooltipProvider'
import { CanvasViewProvider } from './providers/CanvasViewProvider'

ReactDOM.render(
  <React.StrictMode>
    <CanvasViewProvider>
      <CanvasTooltipProvider>
        <App />
      </CanvasTooltipProvider>
    </CanvasViewProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
