import { createBrowserRouter, Link, Outlet, useParams } from 'react-router-dom'
import App from './App.tsx'
import { log } from './common/Logger.ts'

// Dynamic Routes

function NotFound() {
  return <h2>404 Not found</h2>
}

function RouterDemo() {
  return (
    <h2>
      欢迎使用 Lejing Dashboard Pro
      <Link to="..">Back</Link>
    </h2>
  )
}

function Order() {
  const orderId = useParams().id
  return (
    <h2>订单组件, orderId: {orderId}</h2>
  )
}


function Goods() {
  const { goodsId, orderId } = useParams()
  return (
    <div>
      <h2>商品组件</h2>
      <p>Goods ID: {goodsId}, Order ID: {orderId}</p>
    </div>
  )
}

function GoodsPageHasChildren() {
  const params = useParams()
  log.info('params', params)
  return (
    <div>
      <h2>商品页面</h2>
      <Outlet />
    </div>
  )
}

const routerByDynamic = createBrowserRouter(
  [
    { path: '/', element: <App /> },
    { path: '*', element: <NotFound /> },
    { path: '/react', element: <RouterDemo /> },
    { path: '/order/:id', element: <Order /> },
    { path: '/goods/:goodsId/order/:orderId', element: <Goods /> },
    {
      path: 'goods',
      element: <GoodsPageHasChildren />,
      children: [
        { path: ':goodsId', element: <h2>商品详情</h2> },
        {
          path: 'list', element: (
            <div>
              <h2>商品列表</h2>
              <ul>
                <li>Goods：CSDN 狗都不用</li>
                <li>Goods 2</li>
                <li>Goods 3</li>
                <li>Goods 4</li>
              </ul>
            </div>
          )
        },
        {
          path: 'cart', element: (
            <div>
              <h2>购物车</h2>
              <ul>
                <li>iPhone 16 pro Max：¥ 11999</li>
                <li>小米14 pro：¥ 4999</li>
              </ul>
            </div>
          )
        }
      ]
    }
  ],
  { basename: '/dashboard' }
)

export default routerByDynamic
