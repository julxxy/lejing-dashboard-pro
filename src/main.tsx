import { createRoot } from 'react-dom/client'
import { isDebugEnable } from '@/common/debugProvider.ts'
import { log } from '@/common/loggerProvider.ts'
import { StrictMode } from 'react'
import App from '@/App.tsx'
import { Environment } from '@/types/enums.ts'

const root = createRoot(document.getElementById('root')!)

if (isDebugEnable) {
  log.debug(`Debug enabled on '${Environment.current}' mode.`)
}

const appElement = Environment.isProduction() ? (
  <StrictMode>
    <App />
  </StrictMode>
) : (
  <App />
)

root.render(appElement)
