import { createBrowserRouter, Form, redirect, useActionData, useLoaderData, useParams } from 'react-router-dom'
import App from './App.tsx'
import { log } from './common/Logger.ts'

// Dynamic Routes: Loader

function NotFound() {
  return <h2>404 Not found</h2>
}

function Order() {
  const loaderData = useLoaderData()
  const params = useParams()
  log.info('loaderData', loaderData)
  return (
    <h2>订单组件, orderId: {params.id}</h2>
  )
}

function orderLoader({ params }: any) {
  log.info('orderLoader', params.id)
  log.info('token', sessionStorage.token)
  if (!sessionStorage.token) {
    return redirect('/login')
  }
  return fetch(`/order/${params.id}.json`)
}

function Login() {
  const errors: any = useActionData()
  return (
    <div>
      <h2>用户登录</h2>
      <Form method="post">
        <p>
          <input type="text" name="email" />
          {errors?.email && <span>{errors.email}</span>}
        </p>

        <p>
          <input type="text" name="password" />
          {errors?.password && <span>{errors.password}</span>}
        </p>

        <p>
          <button type="submit">登录</button>
        </p>
      </Form>
    </div>
  )
}

async function loginAction({ request }: any) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const errors: any = {}

  // validate the fields
  if (typeof email !== 'string' || !email.includes('@')) {
    errors.email = 'That doesn\'t look like an email address'
  }

  if (typeof password !== 'string' || password.length < 6) {
    errors.password = 'Password must be > 6 characters'
  }

  // return data if we have errors
  if (Object.keys(errors).length) {
    return errors
  }

  async function createUser(email: any, password: any) {
    log.info('createUser', email, password)
    // create the user here
    sessionStorage.token = '88888888'
  }

  // otherwise create the user and redirect
  await createUser(email, password)
  return redirect('/')
}

const routerByDynamic2 = createBrowserRouter(
  [
    { path: '/', element: <App /> },
    { path: '*', element: <NotFound /> },
    { path: '/order/:id', element: <Order />, loader: orderLoader },
    { path: '/login', element: <Login />, action: loginAction }
  ],
  { basename: '/dashboard' }
)

export default routerByDynamic2
