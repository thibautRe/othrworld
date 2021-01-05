import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { CanvasViewProvider } from './providers/CanvasViewProvider'

ReactDOM.render(
  <React.StrictMode>
    <CanvasViewProvider>
      <App />
    </CanvasViewProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
