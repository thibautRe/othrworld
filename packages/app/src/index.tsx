import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { CanvasTooltipProvider } from './providers/CanvasTooltipProvider'
import { CanvasViewProvider } from './providers/CanvasViewProvider'
import { DateProvider } from './providers/DateProvider'
import { SystemProvider } from './providers/SystemProvider'

ReactDOM.render(
  <React.StrictMode>
    <CanvasViewProvider>
      <DateProvider>
        <SystemProvider>
          <CanvasTooltipProvider>
            <App />
          </CanvasTooltipProvider>
        </SystemProvider>
      </DateProvider>
    </CanvasViewProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
