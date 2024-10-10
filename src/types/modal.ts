import React from 'react'

/**
 * 组件的操作行为
 */
export type Action = 'create' | 'edit' | 'delete'

/**
 * 弹窗组件 Props
 */
export interface IModalProps {
  /**
   * 当前是否显示弹窗组件的 Ref 引用, 通过 useRef() 获取
   */
  currentRef: React.MutableRefObject<ModalProps> | undefined
  /**
   * 数据发生变化时接受父组件传递的回调函数
   */
  onRefreshed: () => void
}

/**
 * 弹窗组件的 Ref 引用
 */
export interface ModalProps {
  /**
   * 开启弹窗
   * @param action 操作行为
   * @param data 编辑或新增的数据，用于编辑时传递，显示
   */
  openModal: (action: Action, data?: any) => void
  /**
   * 关闭弹窗
   */
  closeModal: () => void
}
