import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'

// @ts-expect-error unstable_createRoot
ReactDOM.unstable_createBlockingRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
