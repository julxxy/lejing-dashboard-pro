import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import Login from '@/views/Login.tsx'
import Welcome from '@/views/Welcom.tsx'
import PageNotFound from '@/views/404.tsx'
import NoPermission from '@/views/403.tsx'

const routes: RouteObject[] = [
  { path: '/', element: <Welcome /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Navigate to="/404" /> },
  { path: '/404', element: <PageNotFound /> },
  { path: '/403', element: <NoPermission /> }
]

// export const router = createBrowserRouter(routes)

export default function Router() {
  return useRoutes(routes)
}
