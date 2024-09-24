import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { isDebugEnable } from './common/debugEnable.ts'
import { logger } from './common/logger.ts'

if (isDebugEnable) {
  logger.debug('Debug mode is enabled.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
