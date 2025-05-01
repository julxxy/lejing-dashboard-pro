import { createRoot } from 'react-dom/client'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { StrictMode } from 'react'
import App from '@/App.tsx'
import '@ant-design/v5-patch-for-react-19'
import { Environment } from '@/types/enum.ts'

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
