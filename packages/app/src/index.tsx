import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { CanvasViewProvider } from './providers/CanvasViewProvider'
import { SystemProvider } from './providers/SystemProvider'

ReactDOM.render(
  <React.StrictMode>
    <CanvasViewProvider>
      <SystemProvider>
        <App />
      </SystemProvider>
    </CanvasViewProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
