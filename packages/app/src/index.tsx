import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { CanvasTooltipProvider } from './providers/CanvasTooltipProvider'
import { CanvasViewProvider } from './providers/CanvasViewProvider'
import { DateProvider } from './providers/DateProvider'

ReactDOM.render(
  <React.StrictMode>
    <CanvasViewProvider>
      <DateProvider>
        <CanvasTooltipProvider>
          <App />
        </CanvasTooltipProvider>
      </DateProvider>
    </CanvasViewProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
