import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { isDebugEnable } from './common/debugEnable.ts'
import { log } from './common/logger.ts'

if (isDebugEnable) {
  log.debug('Debug mode is enabled.')
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
)
