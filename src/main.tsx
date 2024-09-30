import { createRoot } from 'react-dom/client'
import { isDebugEnable } from './common/debugEnable.ts'
import { log } from './common/logger.ts'
import { StrictMode } from 'react'
import App from '@/App.tsx'

const mode = import.meta.env.MODE
const root = createRoot(document.getElementById('root')!)

if (isDebugEnable) {
  log.debug(`Debug is enabled on ${mode} mode.`)
}

const appElement =
  mode === 'production' ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )

root.render(appElement)
