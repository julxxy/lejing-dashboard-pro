import './loading.less'

let count = 0

/*
let root: ReturnType<typeof createRoot> | null = null // 保存 root 实例
export const showLoading = () => {
  if (count === 0) {
    const loadingElement = document.createElement('div')
    loadingElement.setAttribute('id', 'loading')
    document.body.appendChild(loadingElement) // 插入到 DOM 中

    root = createRoot(loadingElement) // 创建 root 实例
    root.render(<Loading />) // 渲染 Loading 组件
  }
  count++
}

export const hideLoading = () => {
  if (count < 0) return
  count--
  if (count === 0 && root) {
    root.unmount() // 卸载 Loading 组件
    const loadingElement = document.getElementById('loading') as HTMLDivElement
    if (loadingElement) {
      document.body.removeChild(loadingElement) // 从 DOM 中移除元素
    }
  }
}
*/
export const showLoading = () => {
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'flex')
  }
  count++
}
export const hideLoading = () => {
  if (count < 0) return
  count--
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'none')
  }
}
