import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { isDebugEnable } from './common/DebugEnable.ts'
import { log } from './common/Logger.ts'

if (isDebugEnable) {
  log.debug('Debug mode is enabled.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
