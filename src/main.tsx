import { createRoot } from 'react-dom/client'
import './index.css'
import { isDebugEnable } from './common/DebugEnable.ts'
import { log } from './common/Logger.ts'
import { RouterProvider } from 'react-router-dom'
import routerByDynamic2 from './router4.tsx'

if (isDebugEnable) {
  log.debug('Debug mode is enabled.')
}

/*
createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <BaseRouter />
  </HashRouter>
)
*/

/*
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routerByBrowserRouter} />
)
*/

/*
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routerByDynamic} />
)
*/

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routerByDynamic2} />
)


